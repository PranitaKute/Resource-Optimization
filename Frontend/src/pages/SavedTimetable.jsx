// src/pages/SavedTimetable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "../components/Navbar";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SavedTimetable() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimetables = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/timetable/all");
      if (res.data.success) setTimetables(res.data.timetables);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTimetables(); }, []);

  const deleteTimetable = async (id) => {
    if (!window.confirm("Delete this timetable?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/timetable/delete/${id}`
      );
      if (res.data.success) {
        alert("Deleted successfully");
        fetchTimetables();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  const downloadCSV = (table, filename) => {
    // Export in a grid format similar to the on-screen timetable
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
              const teach = entry.teacher || "-";
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

              return extra
                ? `${subj} (${teach} ${extra})`
                : `${subj} (${teach})`;
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
  };

  if (loading) return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <div className="h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-blue-600 font-medium">Fetching saved schedules...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 pb-10">
      <Navbar />
      <div className="p-10 max-w-7xl mx-auto pt-24">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Saved Timetables</h2>
        {timetables.map((item) => (
          <div key={item._id} className="mb-10 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-white-700 p-4 flex justify-between items-center text-black border-b border-gray-200">
              <h3 className="font-bold text-xl">{item.year} – Division {item.division}</h3>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-black/10 hover:bg-black/20 rounded-lg text-sm transition font-semibold">Download CSV</button>
                <button className="px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition font-semibold">Delete</button>
              </div>
            </div>
            <div className="p-6">
              <TableViewer data={item.timetableData} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* TABLE VIEW COMPONENT (same as TimetableViewer but compact) */
/* ------------------------------------------------------------------ */


function TableViewer({ data }) {
  if (!data) return null;

  // DYNAMIC PERIODS
  const allPeriods = new Set();
  DAYS.forEach(day => {
    if (data[day]) Object.keys(data[day]).forEach(p => allPeriods.add(Number(p)));
  });
  const sortedPeriods = Array.from(allPeriods).sort((a, b) => a - b);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full border-collapse text-sm text-center">
        <thead>
          <tr className="bg-blue-600 text-white font-bold">
            <th className="border p-3 w-24">Period</th>
            {DAYS.map((d) => data[d] && (
              <th key={d} className="border p-3 min-w-[160px]">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPeriods.map((p) => (
            <tr key={p} className="hover:bg-gray-50 transition-colors">
              <td className="border p-3 font-bold bg-blue-50 text-blue-700">P{p}</td>
              {DAYS.map((d) => data[d] && (
                <td key={d} className="border p-2 align-top text-left min-h-[100px]">
                  {(data[d][p] || []).map((entry, i) => (
                    <div key={i} className={`p-2 mb-2 border-l-4 rounded shadow-sm ${
                        entry.type === 'Theory' ? 'bg-blue-50 border-blue-500' : 'bg-purple-50 border-purple-500 min-h-[45px]'
                      }`}>
                      <div className="flex justify-between font-bold text-gray-800 text-[12px]">
                        <span>{entry.subject}</span>
                        {entry.batch && <span className="text-[10px] bg-purple-200 px-1 rounded">B{entry.batch}</span>}
                      </div>
                      <div className="text-[11px] text-gray-600 mt-1">
                        <div className="flex items-center gap-1 font-medium">👤 {entry.teacher}</div>
                        <div className="flex items-center gap-1">📍 {entry.room}</div>
                      </div>
                    </div>
                  ))}
                  {(data[d][p] || []).length === 0 && <span className="text-gray-300 block text-center py-4">-</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}