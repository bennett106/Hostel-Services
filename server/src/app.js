require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("../db/connect");
const logger = require("morgan");
const cors = require("cors"); // Import the cors package
const jwt = require("jsonwebtoken"); // Import JWT for token validation
const User = require("./models/user"); // Import your User model

const app = express();
const port = process.env.PORT;

app.use(logger("tiny"));

// Enable CORS for requests from http://localhost:3000/reg
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your actual frontend URL
    methods: ["GET", "POST"], // Add the HTTP methods you intend to use
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Hi, I am live",
  });
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Import the validateToken middleware
const validateToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ status: false, message: "Token required" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return "token expired";
      }
      return decoded;
    });
    const _id = user.user.id;
    if (user === "token expired") {
      return res.status(401).json({ status: "error", data: "token expired" });
    }
    const userInfo = await User.findOne({ _id: _id });
    if (userInfo) {
      req.user = userInfo;
      next(); // Continue to the next middleware
    } else {
      return res.status(401).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Apply validateToken middleware to specific routes as needed
// app.use("/api/v2/", validateToken); // Apply to dayLeave endpoint
// app.use("/api/v3/", validateToken); // Apply to vacationLeave endpoint
// app.use("/api/v4/", validateToken); // Apply to grievances endpoint
// app.use("/api/v5/", validateToken); // Apply to admin endpoint
// app.use("/api/6/")


const dayLeave_endpoint = require("./routes/dayLeave");
const vacationLeave_endpoint = require("./routes/vacationLeave");
const users_endpoint = require("./routes/user");
const grievance_endpoint = require("./routes/grievances");
const admin_endpoint = require("./routes/admin");
// const {showData} = require("./controllers/dayLeave");


// app.use("api/v6/", dayLeave_endpoint); //* for dayleave data through admin


app.use("/api/v1/", users_endpoint);
app.use("/api/v2/", dayLeave_endpoint);
app.use("/api/v3/", vacationLeave_endpoint);
app.use("/api/v4/", grievance_endpoint);
app.use("/api/v5/", admin_endpoint);

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}.`);
    });
    await connectDB(process.env.MONGODB_URI);
  } catch (error) {
    console.log(error);
  }
};

start();
