import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAccountVerified: { type: Boolean, default: false },
  verifyOtp: { type: String, default: '' },
  verifyOtpExpiryAt: { type: Number, default: 0 },
  resetOtp: { type: String, default: '' },
  resetOtpExpireAt: { type: Number, default: 0 },
  role: { type: String, enum: ["teacher", "student"], default: "student" },
  department: { type: String, default: "" },
  
  // ✅ NEW FIELDS FOR STUDENT PROFILE SETUP
  year: { type: String, default: "" },
  division: { type: String, default: "" },
  batch: { type: String, default: "" },
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;