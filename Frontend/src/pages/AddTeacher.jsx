import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

const AddTeacher = () => {
  const { axios } = useAppContext();

  // ADD FORM
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");

  // TABLE DATA
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // UPDATE MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateDepartment, setUpdateDepartment] = useState("");

  /* ===============================
     FETCH TEACHERS
  =============================== */
  const fetchTeachers = async () => {
    try {
      const { data } = await axios.get("/api/teacher", {
        withCredentials: true,
      });
      if (data.success) setTeachers(data.teachers);
    } catch {
      toast.error("Failed to fetch teachers");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  /* ===============================
     ADD TEACHER
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !department || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/admin/add-teacher",
        { name, email, department, password },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Teacher added successfully");
        fetchTeachers();
        setName("");
        setEmail("");
        setDepartment("");
        setPassword("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     OPEN UPDATE MODAL
  =============================== */
  const openUpdateModal = (teacher) => {
    setSelectedTeacher(teacher);
    setUpdateName(teacher.name);
    setUpdateEmail(teacher.email);
    setUpdateDepartment(teacher.department);
    setShowModal(true);
  };

  /* ===============================
     UPDATE TEACHER
  =============================== */
  const handleUpdateTeacher = async () => {
    if (!updateName || !updateEmail || !updateDepartment) {
      toast.error("All fields are required");
      return;
    }

    try {
      const { data } = await axios.put(
        `/api/admin/update-teacher/${selectedTeacher._id}`,
        {
          name: updateName,
          email: updateEmail,
          department: updateDepartment,
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Teacher updated successfully");
        fetchTeachers();
        setShowModal(false);
      }
    } catch {
      toast.error("Failed to update teacher");
    }
  };

  /* ===============================
     DELETE TEACHER
  =============================== */
  const confirmDeleteTeacher = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="font-medium mb-2">
            Are you sure you want to delete this teacher?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm border rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDeleteTeacher(id);
                closeToast();
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleDeleteTeacher = async (id) => {
    try {
      const { data } = await axios.delete(`/api/admin/delete-teacher/${id}`, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success("Teacher deleted");
        fetchTeachers();
      }
    } catch {
      toast.error("Failed to delete teacher");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 px-8 py-10">
      <div className="max-w-6xl mx-auto">
        {/* ================= ADD TEACHER ================= */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            Add Teacher
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              type="text"
              placeholder="Teacher Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Teacher Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-4 mt-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Teacher"}
            </button>
          </form>
        </div>

        {/* ================= TEACHERS TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border">
          <h3 className="text-xl font-semibold mb-4 text-slate-800">
            Teachers List
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-slate-700">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No teachers added yet
                    </td>
                  </tr>
                ) : (
                  teachers.map((t) => (
                    <tr
                      key={t._id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="p-3">{t.name}</td>
                      <td className="p-3">{t.email}</td>
                      <td className="p-3">{t.department}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openUpdateModal(t)}
                            className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => confirmDeleteTeacher(t._id)}
                            className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= UPDATE MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Update Teacher</h3>

            <input
              type="text"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
              placeholder="Name"
              className="w-full mb-3 px-3 py-2 rounded bg-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
              placeholder="Email"
              className="w-full mb-3 px-3 py-2 rounded bg-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              value={updateDepartment}
              onChange={(e) => setUpdateDepartment(e.target.value)}
              placeholder="Department"
              className="w-full mb-4 px-3 py-2 rounded bg-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTeacher}
                className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTeacher;
