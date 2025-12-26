import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ["Classroom", "Lab", "Tutorial"],
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    department: {
        type: String,
        default: "Software Engineering",
    }
}, { timestamps: true });

const roomModel = mongoose.models.room || mongoose.model("room", roomSchema);
export default roomModel;