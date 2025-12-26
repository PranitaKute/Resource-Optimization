import express from "express";
import { addRoom, getRooms, deleteRoom } from "../controllers/roomController.js";

const router = express.Router();

router.post("/add", addRoom);
router.get("/all", getRooms);
router.delete("/delete/:id", deleteRoom);

export default router;