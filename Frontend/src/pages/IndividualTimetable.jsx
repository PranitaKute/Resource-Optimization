// src/pages/IndividualTeacherTimetable.jsx - UPDATED: Matches SavedTimetable styling
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { Navbar } from "../components/Navbar";
import {
  TimetableTable,
  downloadTimetableCSV,
} from "../utils/renderTimetableCell.jsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function IndividualTeacherTimetable() {
  const { userData } = useAppContext();
  const [teacherTT, setTeacherTT] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndBuild = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/timetable/all`);

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
      <>
        <Navbar />
        <div className="p-6 flex flex-col items-center justify-center min-h-screen">
          <div className="h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-blue-600 font-medium">
            Fetching your teaching timetable...
          </p>
        </div>
      </>
    );
  }

  if (!teacherTT) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 pt-20">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-6">
              <span className="text-4xl">📚</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Timetable Found
            </h2>

            {/* Description */}
            <p className="text-gray-500 max-w-md">
              No classes have been assigned to you yet. Please contact the administrator.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 pt-20">
        <div className="pt-5 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            My Teaching Timetable
          </h2>

          <div className="border p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <h3 className="font-bold text-base sm:text-lg md:text-xl">
                👤 {userData.name}
              </h3>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() =>
                    downloadTimetableCSV(teacherTT, userData.name, DAYS)
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
                data={teacherTT}
                DAYS={DAYS}
                renderOptions={{
                  showYearDivision: true, // Show which class they're teaching
                  filterByBatch: null, // No batch filtering
                  highlightBatch: false, // No highlighting
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =======================================================
   BUILD TIMETABLE FOR LOGGED-IN TEACHER
   ✅ CRITICAL: Preserves TIME SLOTS, not period numbers
   ✅ CRITICAL: Preserves lab_part for multi-hour labs
======================================================= */
function buildTeacherTimetables(classTimetables, loggedTeacherName) {
  const teacherMap = {};

  classTimetables.forEach((doc) => {
    const year = doc.year;
    const division = doc.division;
    const table = doc.timetableData || {};

    // For each day in the timetable
    Object.keys(table).forEach((day) => {
      const dayData = table[day] || {};

      // For each time slot (e.g., "08:00-09:00", "09:00-10:00")
      Object.keys(dayData).forEach((timeSlot) => {
        const entries = dayData[timeSlot] || [];

        // Filter for logged-in teacher's classes
        entries.forEach((entry) => {
          if (
            !entry.teacher ||
            entry.teacher.trim().toLowerCase() !== loggedTeacherName
          )
            return;

          if (!teacherMap[day]) teacherMap[day] = {};
          if (!teacherMap[day][timeSlot]) teacherMap[day][timeSlot] = [];

          // ✅ PRESERVE ALL FIELDS including lab_part
          teacherMap[day][timeSlot].push({
            subject: entry.subject,
            type: entry.type,
            teacher: entry.teacher,
            year: entry.year || year,
            division: entry.division || division,
            room: entry.room,
            batch: entry.batch,
            time_slot: timeSlot,
            lab_part: entry.lab_part, // ✅ CRITICAL: "1/2", "2/2" etc.
            lab_session_id: entry.lab_session_id, // ✅ CRITICAL: Session grouping
          });
        });
      });
    });
  });

  return Object.keys(teacherMap).length ? teacherMap : null;
}