const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
    try { 
        const token = req.cookies.AuthToken; 
        if (!token) {
            return res.status(401).json({ message: "Unauthorized from Agent Interview" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decodedToken.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error on Auth" });
    }
} 

module.exports = isAuth;