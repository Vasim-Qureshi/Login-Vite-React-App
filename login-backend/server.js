const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const SECRET_KEY = "your_secret_key";
const REFRESH_SECRET = "your_refresh_secret";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Important for cookies
  })
);

let refreshTokens = [];

// Generate Tokens
const generateAccessToken = (user) => jwt.sign(user, SECRET_KEY, { expiresIn: "15m" });
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
  refreshTokens.push(refreshToken);
  return refreshToken;
};

// Middleware to Verify Access Token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password123") {
    const user = { username };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production (HTTPS required)
      sameSite: "lax",
    });

    return res.json({ accessToken });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// Refresh Token Route
app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token found" });
  }

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    // Prevent infinite refresh loop
    const newAccessToken = generateAccessToken({ username: user.username });
    if (!newAccessToken) {
      return res.status(500).json({ message: "Failed to generate access token" });
    }

    res.json({ accessToken: newAccessToken });
  });
});

// Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
  res.json({ message: "Logged out successfully" });
});

// Protected Route
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "Profile Data", user: req.user });
});

app.listen(5000, () => console.log("Server running on port 5000"));
