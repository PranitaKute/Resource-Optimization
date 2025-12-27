import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId; // FIXED

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                role: user.role, 
                isAccountVerified: user.isAccountVerified,
                department: user.department,
                year: user.year,
                division: user.division,
                batch: user.batch
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// NEW: Update Student Profile
export const updateStudentProfile = async (req, res) => {
    const { department, year, division, batch } = req.body;
    const userId = req.userId; // Provided by userAuth middleware

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.department = department;
        user.year = year;
        user.division = division;
        user.batch = batch;

        await user.save();
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

