import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  isAccountVerified: { type: Boolean, default: false },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpiryAt: { type: Number, default: 0 },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },

  role: { type: String, enum: ["teacher", "student"], default: "student" },

  // =========================
  // ACADEMIC DETAILS (NEW)
  // =========================
  department: { type: String },
  admissionYear: { type: Number },      // ✅ stored
  division: { type: String},
  batch: { type: String, default: "" }, // filled in profile setup
});

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
