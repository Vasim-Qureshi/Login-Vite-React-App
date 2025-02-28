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
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

let refreshTokens = []; // Store refresh tokens (in production, use a DB)

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(user, SECRET_KEY, { expiresIn: "15m" }); // Short-lived
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" }); // Long-lived
  refreshTokens.push(refreshToken);
  return refreshToken;
};

// Middleware to Verify Access Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

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
      sameSite: "Strict",
    });

    return res.json({ accessToken });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// Refresh Token Route
app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || !refreshTokens.includes(refreshToken))
    return res.status(403).json({ message: "Forbidden" });

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const newAccessToken = generateAccessToken({ username: user.username });
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
