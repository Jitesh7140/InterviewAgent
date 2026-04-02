const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = generateToken;
