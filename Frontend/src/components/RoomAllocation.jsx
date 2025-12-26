import React, { useState, useEffect } from "react"; // Added useEffect import
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

export default function RoomAllocation({ yearData, rooms, setRooms, onBack, onGenerate }) {
  const { axios } = useAppContext();
  const [dbRooms, setDbRooms] = useState([]); // Database rooms
  const [selectedRoomId, setSelectedRoomId] = useState("");
  
  // State for manual overrides if needed (referenced in your UI)
  const [roomType, setRoomType] = useState("Classroom");
  const [capacity, setCapacity] = useState(60);

  // Fetch rooms from database on component mount
  useEffect(() => {
    const fetchDbRooms = async () => {
      try {
        const { data } = await axios.get("/api/rooms/all");
        if (data.success) {
          setDbRooms(data.rooms);
        }
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        toast.error("Failed to load rooms from database");
      }
    };
    fetchDbRooms();
  }, [axios]);

  const addRoom = () => {
    const roomObj = dbRooms.find(r => r._id === selectedRoomId);
    if (!roomObj) return toast.error("Select a room from the list");
    
    // Check for duplicates in the current selection
    if (rooms.find(r => r.name === roomObj.name)) {
      return toast.error("Room already added to this schedule");
    }
    
    // Add room to the list. We include properties from the DB room 
    // but keep your UI structure (using 'id' for removal logic)
    setRooms([...rooms, { 
      ...roomObj, 
      id: roomObj._id 
    }]);
    
    setSelectedRoomId("");
    toast.success("Room added to selection");
  };

  const removeRoom = (id) => {
    if (!window.confirm("Are you sure you want to remove this room?")) return;

    setRooms(rooms.filter((r) => r.id !== id));
    toast.success("Room removed successfully");
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-100 animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        🏫 Room Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Room Name</label>
          <select 
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 bg-white"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
          >
            <option value="">Select Room</option>
            {dbRooms.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} ({r.type})
              </option>
            ))}
          </select>
        </div>

      
        <div className="flex items-end">
          <button 
            onClick={addRoom}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            + Add Room
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {rooms.map((room) => (
          <div key={room.id} className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
            <div>
              <span className="font-bold text-lg">{room.name}</span>
              <span className="ml-3 px-2 py-1 bg-gray-100 rounded text-xs uppercase font-bold text-gray-600">
                {room.type}
              </span>
              <p className="text-sm text-gray-500">Capacity: {room.capacity}</p>
            </div>
            <button 
              onClick={() => removeRoom(room.id)}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Remove
            </button>
          </div>
        ))}
        {rooms.length === 0 && (
          <p className="text-center text-gray-400 py-10">No rooms added. Please select rooms above.</p>
        )}
      </div>

      <div className="flex justify-between mt-10 pt-6 border-t">
        <button onClick={onBack} className="px-6 py-2 border rounded-xl hover:bg-gray-50">Back</button>
        <button 
          onClick={onGenerate} 
          className="px-10 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
        >
          Generate Timetable
        </button>
      </div>
    </div>
  );
}