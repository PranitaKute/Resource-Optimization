import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

/* =====================================================
   ADD TEACHER
===================================================== */
export const addTeacher = async (req, res) => {
  const { name, email, department, password } = req.body;

  if (!name || !email || !department || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Teacher already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await userModel.create({
      name,
      email,
      department,
      password: hashedPassword,
      role: "teacher",
      isAccountVerified: false,
    });

    return res.status(201).json({
      success: true,
      message: "Teacher added successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   UPDATE TEACHER
===================================================== */
export const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, department } = req.body;

  if (!name || !department) {
    return res.status(400).json({
      success: false,
      message: "Name and department are required",
    });
  }

  try {
    const teacher = await userModel.findById(id);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    teacher.name = name;
    teacher.department = department;
    await teacher.save();

    return res.json({
      success: true,
      message: "Teacher updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   DELETE TEACHER
===================================================== */
export const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await userModel.findById(id);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    await userModel.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
