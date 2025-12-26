import { NavLink, Outlet, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

export default function AdminLayout() {
  const { axios, navigate, setIsAdmin } = useAppContext();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post("/api/admin/logout");

      if (data.success) {
        toast.success("Admin logged out");
        setIsAdmin(false);
        navigate("/admin/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const sidebar = [
    {
      name: "Timetable Generate",
      path: "/admin/dashboard",
      icon: assets.dashboard_icon,
    },
    {
      name: "View Timetable",
      path: "/admin/saved",
      icon: assets.saved_icon,
    },
    {
      name: "Teacher Timetables",
      path: "/admin/teachers",
      icon: assets.teacher_icon,
    },
    {
      name: "Add Teacher",
      path: "/admin/add-teacher",
      icon: assets.add_icon,
    },
     {
      name: "Add Room",
      path: "/admin/add-room",
      icon: assets.room_icon, // or use a Lucide icon like <Building2 size={20} />
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            R
          </div>
          <span className="font-bold text-lg text-gray-800">ResourceOPT</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, Admin</span>
          <button
            onClick={handleLogout}
            className="border rounded-full px-4 py-1 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r overflow-y-auto mt-2">
        {sidebar.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition ${
                isActive
                  ? "bg-blue-100 border-r-4 border-blue-600 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <img src={item.icon} alt={item.name} className="w-6 h-6" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </aside>

      {/* ================= CONTENT ================= */}
      <main className="pt-16 pl-64 p-6">
        <Outlet />
      </main>
    </div>
  );
}