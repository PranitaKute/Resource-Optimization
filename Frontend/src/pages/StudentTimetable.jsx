// src/pages/SavedTimetable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext"; // Import context to get student profile
import { Navbar } from "../components/Navbar";

export default function SavedTimetable() {
  const { userData } = useAppContext(); // Get profile details (year, division, batch)
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimetables = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/timetable/all");

      if (res.data.success) {
        let allData = res.data.timetables;

        // ✅ FILTER LOGIC FOR STUDENTS
        if (userData?.role === "student") {
          allData = allData.filter(
            (item) =>
              item.year === userData.year && 
              String(item.division) === String(userData.division)
          );
        }

        setTimetables(allData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch saved timetables");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTimetables();
  }, [userData]); // Re-fetch if profile changes


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
  if (loading)
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-blue-600 font-medium">Fetching data…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 py-10">
      <div className="p-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          {userData?.role === "student" ? "My Class Timetable" : "Saved Timetables"}
        </h2>

        {timetables.length === 0 && (
          <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
            No timetable found for {userData?.year} Div {userData?.division}.
          </div>
        )}

        {timetables.map((item) => (
          <div key={item._id} className="border p-6 mb-6 bg-white rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-blue-800">
                {item.year} – Division {item.division}
                {userData?.batch && <span className="ml-3 text-sm font-medium bg-blue-100 text-blue-600 px-3 py-1 rounded-full">Batch {userData.batch}</span>}
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadCSV(item.timetableData, `${item.year}_Div${item.division}`)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
                >
                  Download CSV
                </button>
                
                {/* Only Admin sees Delete */}
                {userData?.role !== "student" && (
                  <button
                    onClick={() => deleteTimetable(item._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* PASS STUDENT BATCH TO THE TABLE VIEWER */}
            <TableViewer data={item.timetableData} studentBatch={userData?.batch} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* UPDATED TABLE VIEW COMPONENT WITH BATCH FILTERING */
/* ------------------------------------------------------------------ */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const PERIODS = [1, 2, 3, 4, 5, 6];

function TableViewer({ data, studentBatch }) {
  if (!data) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <Navbar/>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-blue-600 text-white font-bold">
            <th className="border p-3 w-24">Period</th>
            {DAYS.map((d) => (
              <th key={d} className="border p-3 min-w-[150px]">{d}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {PERIODS.map((p) => (
            <tr key={p} className="hover:bg-gray-50 transition-colors">
              <td className="border p-3 font-bold bg-blue-50 text-blue-700 text-center">P{p}</td>

              {DAYS.map((d) => (
                <td key={d} className="border p-2 align-top min-h-[100px]">
                  {(data[d]?.[p] || [])
                    .filter(entry => {
                        // ✅ FILTER: If entry is a Lab/Tutorial and has a batch, only show if it matches student's batch
                        if (studentBatch && entry.batch && entry.type !== "Theory") {
                            return String(entry.batch) === String(studentBatch);
                        }
                        return true; // Show all theory/unbatched classes
                    })
                    .map((entry, i) => (
                    <div
                      key={i}
                      className={`p-2 mb-2 border-l-4 rounded shadow-sm ${
                        entry.type === 'Theory' 
                          ? 'bg-blue-50 border-blue-500' 
                          : 'bg-purple-50 border-purple-500'
                      }`}
                    >
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>{entry.subject}</span>
                        {entry.batch && <span className="text-[10px] bg-purple-200 px-1 rounded">B{entry.batch}</span>}
                      </div>
                      <div className="text-[11px] text-gray-600 mt-1">
                        <div className="flex items-center gap-1">👤 {entry.teacher}</div>
                        <div className="flex items-center gap-1">📍 {entry.room}</div>
                      </div>
                    </div>
                  ))}
                  {(data[d]?.[p] || []).length === 0 && <span className="text-gray-300 block text-center py-4">-</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}