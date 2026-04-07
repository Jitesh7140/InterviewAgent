const User = require("../model/user.model.js");
const generateToken = require("../config/JwtToken.js");

// Ek hi jagah options define karein taaki mismatch na ho
const cookieOptions = {
  httpOnly: true,
  secure: true,      // HTTPS ke liye
  sameSite: "none",  // Cross-site requests ke liye
  path: "/",         // Poore domain ke liye
};

exports.googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email });
      await user.save();
    }

    const token = await generateToken(user._id);

    // Cookie set karein
    res.cookie("AuthToken", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    // Exact same options ke saath cookie clear karein
    res.clearCookie("AuthToken", cookieOptions);
    
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};