const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

// manaul models
const AuthRoute = require("./routes/AuthRoute");
const UserRoute = require("./routes/UserRoute");
const InterviewRoute = require("./routes/interview");
const connectDB = require("./config/db");
connectDB();
 

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());




app.use('/api/auth',AuthRoute)
app.use('/api/user',UserRoute)
app.use('/api/interview',InterviewRoute)




app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});