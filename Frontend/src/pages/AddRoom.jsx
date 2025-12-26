import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

const AddRoom = () => {
  const { axios } = useAppContext();
  const [formData, setFormData] = useState({ name: "", type: "Classroom", capacity: 60 });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms/all");
      if (data.success) setRooms(data.rooms);
    } catch (error) {
      toast.error("Failed to fetch rooms");
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/rooms/add", formData);
      if (data.success) {
        toast.success("Room added successfully");
        fetchRooms();
        setFormData({ name: "", type: "Classroom", capacity: 60 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding room");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await axios.delete(`/api/rooms/delete/${id}`);
      toast.success("Room deleted");
      fetchRooms();
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6">Manage Room </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Room Name (e.g. B101)" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value.toUpperCase()})} className="border p-2 rounded" required />
          <select value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})} className="border p-2 rounded">
            <option value="Classroom">Classroom</option>
            <option value="Lab">Lab</option>
            <option value="Tutorial">Tutorial</option>
          </select>
          <input type="number" value={formData.capacity} onChange={(e)=>setFormData({...formData, capacity: e.target.value})} className="border p-2 rounded" required />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white rounded p-2">{loading ? "Adding..." : "Add Room"}</button>
        </form>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <table className="w-full text-left">
          <thead><tr className="border-b"><th>Name</th><th>Type</th><th>Capacity</th><th>Action</th></tr></thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="py-3">{r.name}</td>
                <td>{r.type}</td>
                <td>{r.capacity}</td>
                <td><button onClick={() => handleDelete(r._id)} className="text-red-500">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AddRoom;