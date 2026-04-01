const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();



const connectDB = require("./config/db");
connectDB();
 

const app = express();
const PORT = process.env.PORT;

app.use('/', (req, res) => {
  res.send("Hello World");
})

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});