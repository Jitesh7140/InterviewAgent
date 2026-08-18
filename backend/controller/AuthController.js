const User = require("../model/user.model.js");
const generateToken = require("../config/JwtToken.js");

// Ek hi jagah options define karein taaki mismatch na ho
// Local (http://localhost) pe secure+sameSite=none cookie set hi nahi hoti,
// isliye production me hi strict cross-site cookie use karo.
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,               // HTTPS ke liye (prod)
  sameSite: isProduction ? "none" : "lax", // Cross-site requests ke liye (prod), localhost pe lax
  path: "/",                          // Poore domain ke liye
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