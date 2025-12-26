import roomModel from "../models/roomModel.js";

// Add a new room
export const addRoom = async (req, res) => {
    try {
        const { name, type, capacity } = req.body;

        if (!name || !type || !capacity) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingRoom = await roomModel.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ success: false, message: "Room name already exists" });
        }

        const newRoom = new roomModel({ name, type, capacity });
        await newRoom.save();

        res.status(201).json({ success: true, message: "Room added successfully", room: newRoom });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all rooms
export const getRooms = async (req, res) => {
    try {
        const rooms = await roomModel.find({}).sort({ name: 1 });
        res.json({ success: true, rooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a room
export const deleteRoom = async (req, res) => {
    try {
        await roomModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Room deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};