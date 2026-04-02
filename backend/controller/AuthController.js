const User = require("../model/user.model.js");
const jwt = require("jsonwebtoken");
const generateToken = require("../config/JwtToken.js"); 

exports.googleAuth = async (req, res) => {
  try {
    const {name ,email } = req.body;
    const user = await User.findOne({email});
    if(user){
      return res.status(200).json({message:"User already exists"});
    }
    const newUser = new User({
      name,
      email, 
    });
    await newUser.save();
    
    let token = await generateToken(newUser._id)
    res.cookie("AuthToken" , token , {
      httpOnly: true,
      secure: true,
      sameSite:"strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      message:"User created successfully",
      user:newUser,
      token,
    }) 
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Internal server error on Google Auth"});
  }
};


exports.logout = async (req, res) => {
  try {
    res.clearCookie("AuthToken");
    res.status(200).json({message:"User logged out successfully"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Internal server error on Logout"});
  }
};