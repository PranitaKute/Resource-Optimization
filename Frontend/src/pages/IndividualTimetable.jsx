// src/pages/IndividualTeacherTimetable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { Navbar } from "../components/Navbar";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function IndividualTeacherTimetable() {
  const { userData } = useAppContext();
  const [teacherTT, setTeacherTT] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndBuild = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/timetable/all");

        if (res.data.success && userData?.name) {
          const teacherName = userData.name.trim().toLowerCase();

          const teacherMap = buildTeacherTimetables(
            res.data.timetables || [],
            teacherName
          );

          setTeacherTT(teacherMap);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.name) fetchAndBuild();
  }, [userData]);

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-blue-600 font-medium">
          Fetching your teaching timetable...
        </p>
      </div>
    );
  }

  if (!teacherTT) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No timetable found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 pb-10">
      <Navbar />

      <div className="p-10 max-w-7xl mx-auto pt-24">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          My Teaching Timetable — {userData.name}
        </h2>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-white p-5 border-b border-gray-100">
            <h3 className="font-bold text-2xl text-blue-900">
              Weekly Schedule
            </h3>
          </div>

          <div className="p-6">
            <TeacherTable data={teacherTT} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =======================================================
   BUILD TIMETABLE FOR LOGGED-IN TEACHER (UNCHANGED LOGIC)
======================================================= */
function buildTeacherTimetables(classTimetables, loggedTeacherName) {
  const teacherMap = {};

  classTimetables.forEach((doc) => {
    const year = doc.year;
    const division = doc.division;
    const table = doc.timetableData || {};

    Object.keys(table).forEach((day) => {
      Object.keys(table[day] || {}).forEach((period) => {
        const cell = table[day][period] || [];

        cell.forEach((entry) => {
          if (
            !entry.teacher ||
            entry.teacher.trim().toLowerCase() !== loggedTeacherName
          )
            return;

          if (!teacherMap[day]) teacherMap[day] = {};
          if (!teacherMap[day][period]) teacherMap[day][period] = [];

          teacherMap[day][period].push({
            ...entry,
            year,
            division,
          });
        });
      });
    });
  });

  return Object.keys(teacherMap).length ? teacherMap : null;
}

/* =======================================================
   TABLE UI — SAME STYLE AS STUDENT TIMETABLE
======================================================= */
function TeacherTable({ data }) {
  const allPeriods = new Set();
  DAYS.forEach((day) => {
    if (data[day]) {
      Object.keys(data[day]).forEach((p) => allPeriods.add(Number(p)));
    }
  });
  const sortedPeriods = Array.from(allPeriods).sort((a, b) => a - b);

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-blue-600 text-white font-bold">
            <th className="border p-4 w-24 text-center">Period</th>
            {DAYS.map(
              (d) =>
                data[d] && (
                  <th key={d} className="border p-4 min-w-[160px] text-center">
                    {d}
                  </th>
                )
            )}
          </tr>
        </thead>

        <tbody>
          {sortedPeriods.map((p) => (
            <tr key={p} className="hover:bg-blue-50/30 transition-colors">
              <td className="border p-4 font-black bg-blue-50 text-blue-700 text-center text-lg">
                P{p}
              </td>

              {DAYS.map(
                (d) =>
                  data[d] && (
                    <td key={d} className="border p-3 align-top min-h-[110px]">
                      {(data[d][p] || []).map((entry, i) => (
                        <div
                          key={i}
                          className="p-3 mb-2 border-l-4 rounded-xl shadow-md bg-blue-50 border-blue-500 transition-transform hover:scale-[1.02]"
                        >
                          <div className="font-bold text-gray-900 text-[13px]">
                            {entry.subject}
                          </div>

                          <div className="text-[11px] text-gray-600 mt-2 space-y-1">
                            <div>
                              👥 {entry.year} — Div {entry.division}
                            </div>
                            <div>📍 {entry.room}</div>
                          </div>
                        </div>
                      ))}

                      {(data[d][p] || []).length === 0 && (
                        <div className="py-8 text-center">
                          <span className="text-gray-300 font-medium tracking-widest text-[10px] uppercase">
                            No Class
                          </span>
                        </div>
                      )}
                    </td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
