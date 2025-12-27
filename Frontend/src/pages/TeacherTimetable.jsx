// src/pages/TeacherTimetable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TeacherTimetable() {
  const [teacherTTs, setTeacherTTs] = useState([]);
  const [globalConfig, setGlobalConfig] = useState({ activeDays: [], maxPeriods: [] }); // Track institutional days/periods
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndBuild = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/timetable/all");
        if (res.data.success) {
          const timetables = res.data.timetables || [];
          
          // 1. Extract institutional active days and periods (ignoring holidays)
          const daysFound = new Set();
          const periodsFound = new Set();
          timetables.forEach(doc => {
            Object.keys(doc.timetableData || {}).forEach(day => {
              daysFound.add(day);
              Object.keys(doc.timetableData[day]).forEach(p => periodsFound.add(Number(p)));
            });
          });

          setGlobalConfig({
            activeDays: DAYS.filter(d => daysFound.has(d)),
            maxPeriods: Array.from(periodsFound).sort((a, b) => a - b)
          });

          const teacherMap = buildTeacherTimetables(timetables);
          setTeacherTTs(teacherMap);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
      setLoading(false);
    };
    fetchAndBuild();
  }, []);


  if (loading) return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <div className="h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-blue-600 font-medium">Loading faculty schedules...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 pb-10">
      <Navbar />
      <div className="p-10 max-w-7xl mx-auto pt-24">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Teacher Timetables</h2>
        {teacherTTs.length === 0 && <p className="text-gray-500 italic">No teacher schedules found.</p>}
        {teacherTTs.map((tt) => (
          <div key={tt.teacher} className="mb-12 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-white p-4 flex justify-between items-center text-black border-b border-gray-200">
              <h3 className="font-bold text-xl">{tt.teacher}</h3>
              <button className="px-4 py-1.5 bg-black/10 hover:bg-black/20 rounded-lg text-sm transition font-semibold">Download CSV</button>
            </div>
            <div className="p-6">
              {/* Pass institutional config to ensure all days/periods show up */}
              <TeacherTable data={tt.timetable} config={globalConfig} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildTeacherTimetables(classTimetables) {
  const teacherMap = {};

  classTimetables.forEach((doc) => {
    const year = doc.year;
    const division = doc.division;
    const table = doc.timetableData || {};

    Object.keys(table || {}).forEach((day) => {
      const dayData = table[day] || {};
      Object.keys(dayData).forEach((period) => {
        const cell = dayData[period] || [];

        cell.forEach((entry) => {
          const teacher = entry.teacher;
          if (!teacher) return;

          if (!teacherMap[teacher]) {
            teacherMap[teacher] = {};
          }
          if (!teacherMap[teacher][day]) {
            teacherMap[teacher][day] = {};
          }
          if (!teacherMap[teacher][day][period]) {
            teacherMap[teacher][day][period] = [];
          }

          teacherMap[teacher][day][period].push({
            ...entry,
            year: entry.year || year,
            division: entry.division || division,
          });
        });
      });
    });
  });

  return Object.keys(teacherMap).map((teacher) => ({
    teacher,
    timetable: teacherMap[teacher],
  }));
}

function downloadCSV(table, filename) {
  let csv = "Period / Day";
  DAYS.forEach((d) => {
    csv += `,${d}`;
  });
  csv += "\n";

  PERIODS.forEach((p) => {
    csv += `P${p}`;
    DAYS.forEach((d) => {
      const cell = table[d]?.[p] || [];

      if (cell.length === 0) {
        csv += ",-";
      } else {
        const combined = cell
          .map((entry) => {
            const subj = entry.subject || "-";
            const yr = entry.year || "";
            const div = entry.division || "";
            const room = entry.room || "";

            const extra = [
              yr && `Y:${yr}`,
              div && `Div:${div}`,
              room && `R:${room}`,
            ]
              .filter(Boolean)
              .join(" ");

            return extra ? `${subj} (${extra})` : subj;
          })
          .join(" | ");

        csv += `,"${combined}"`;
      }
    });
    csv += "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename + ".csv";
  link.click();
}


function TeacherTable({ data, config }) {
  if (!data || !config) return null;

  // Use institutional active days and periods instead of per-teacher entries
  const { activeDays, maxPeriods } = config;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-blue-600 text-white font-bold">
            <th className="border p-3 w-24 text-center">Period</th>
            {activeDays.map((d) => (
              <th key={d} className="border p-3 min-w-[160px] text-center">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {maxPeriods.map((p) => (
            <tr key={p} className="hover:bg-gray-50 transition-colors">
              <td className="border p-3 font-bold bg-blue-50 text-blue-700 text-center">P{p}</td>
              {activeDays.map((d) => (
                <td key={d} className="border p-2 align-top min-h-[100px]">
                  {/* Safely check if teacher has an entry for this institutional slot */}
                  {(data[d]?.[p] || []).map((entry, i) => (
                    <div key={i} className={`p-2 mb-2 border-l-4 rounded shadow-sm ${
                        entry.type === 'Theory' ? 'bg-blue-50 border-blue-500' : 'bg-purple-50 border-purple-500 min-h-[45px]'
                      }`}>
                      <div className="flex justify-between font-bold text-gray-800 text-[12px]">
                        <span>{entry.subject}</span>
                        {entry.batch && <span className="text-[10px] bg-purple-200 px-1 rounded">B{entry.batch}</span>}
                      </div>
                      <div className="text-[11px] text-gray-600 mt-1 space-y-0.5">
                        <div className="flex items-center gap-1 font-medium text-blue-700">🎓 {entry.year} | Div {entry.division}</div>
                        <div className="flex items-center gap-1">📍 Room: {entry.room}</div>
                      </div>
                    </div>
                  ))}
                  {/* If no entry, the cell remains empty but visible (the non-working period for teacher) */}
                  {(!data[d]?.[p] || data[d][p].length === 0) && <span className="text-gray-300 block text-center py-4">-</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

