const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const SECRET_KEY = "your_secret_key"; // Keep this secret

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend to send cookies

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Dummy authentication (replace with DB check)
  if (username === "admin" && password === "password123") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false, // Set to true in production (HTTPS required)
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({ message: "Login successful" });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logged out successfully" });
});

// Protected Route
app.get("/profile", (req, res) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    res.json({ message: "Profile Data", user: decoded });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
