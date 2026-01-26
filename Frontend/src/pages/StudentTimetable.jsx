// src/pages/StudentTimetable.jsx - UPDATED: Matches SavedTimetable styling
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { Navbar } from "../components/Navbar";
import {
  TimetableTable,
  downloadTimetableCSV,
} from "../utils/renderTimetableCell.jsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* =========================
   Academic Year Resolver
   (from admissionYear)
========================= */
const getAcademicYearLabel = (admissionYear) => {
  if (!admissionYear) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  const month = now.getMonth(); // Jan = 0

  // Academic year starts around July
  const academicBase = month >= 6 ? currentYear : currentYear - 1;
  const yearNum = academicBase - admissionYear + 1;

  if (yearNum === 1) return "1st";
  if (yearNum === 2) return "2nd";
  if (yearNum === 3) return "3rd";
  if (yearNum === 4) return "4th";

  return null;
};

export default function StudentTimetable() {
  const { userData } = useAppContext();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimetables = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/timetable/all`);

      if (res.data.success) {
        let allData = res.data.timetables;

        if (userData?.role === "student") {
          const academicYear = getAcademicYearLabel(userData?.admissionYear);

          allData = allData.filter(
            (item) =>
              item.year === academicYear &&
              String(item.division) === String(userData.division) &&
              item.department === userData.department
          );
        }

        setTimetables(allData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userData) {
      fetchTimetables();
    }
  }, [userData]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6 flex flex-col items-center justify-center min-h-screen">
          <div className="h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-blue-600 font-medium">
            Fetching your personal timetable...
          </p>
        </div>
      </>
    );
  }

  const academicYearLabel = getAcademicYearLabel(userData?.admissionYear);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 pt-20">
        <div className="pt-5 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {userData?.role === "student" ? "My Class Timetable" : "View Timetable"}
          </h2>

          {timetables.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-6">
                <span className="text-4xl">📅</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Timetable Found
              </h2>

              {/* Description */}
              <p className="text-gray-500 max-w-md mb-6">
                No timetable found for{" "}
                <span className="font-semibold">
                  {academicYearLabel} Year — Division {userData?.division}
                </span>
                . Please contact your administrator.
              </p>
            </div>
          )}

          {timetables.map((item) => (
            <div
              key={item._id}
              className="border p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl shadow-md"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-lg md:text-xl">
                    {item.year} — Division {item.division}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Department: {item.department}
                  </p>
                  {userData?.batch && (
                    <p className="text-xs sm:text-sm text-blue-600 font-semibold mt-1">
                      Batch: {userData.batch}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() =>
                      downloadTimetableCSV(
                        item.timetableData,
                        `${item.year}_Div${item.division}`,
                        DAYS
                      )
                    }
                    className="flex-1 sm:flex-initial px-3 py-1.5 sm:py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs sm:text-sm transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* ✅ UNIFIED RENDERER - Same as saved timetable */}
              <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
                <TimetableTable
                  data={item.timetableData}
                  DAYS={DAYS}
                  renderOptions={{
                    showYearDivision: false,
                    filterByBatch: userData?.batch,
                    highlightBatch: true,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}