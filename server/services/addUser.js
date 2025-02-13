require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const Cookies = require("cookies");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const addUser = async (req, res) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");
  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return;
  }
  const user = jwt.verify(token, process.env.JWT_SECRET);
  if (user.role !== "admin") {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    const { username, password, dob, profilePicture } = JSON.parse(body);
    console.log("Profile picture:", profilePicture);
    if (!username || !password || !dob || !profilePicture) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Missing required fields" }));
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
      const [result] = await db.query(
        "INSERT INTO staff (name, dob, password, profile_picture) VALUES (?, ?, ?, ?)",
        [username, dob, hashedPassword, profilePicture]
      );
      if (result.affectedRows > 0) {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User created successfully" }));
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User creation failed" }));
      }
    } catch (error) {
      console.error("Error adding user:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    }
  });
};

module.exports = addUser;
