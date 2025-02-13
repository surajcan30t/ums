require("dotenv").config();
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    const { name, email, password } = JSON.parse(body);
    if (!name || !email || !password) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Insufficient Data" }));
    }
    const db = require("../db");
    const hash = await bcrypt.hash(password, 10);
    try {
      const [result] = await db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hash]
      );

      if (result.affectedRows > 0) {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User registered successfully" }));
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User registration failed" }));
      }
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User already exists" }));
      } else {
        console.error("Database error:", e);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    }
  });
};

module.exports = signup;
