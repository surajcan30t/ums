require("dotenv").config();
const http = require("http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
const Cookies = require("cookies");
const login = require("./services/login");
const signup = require("./services/signup");
const getAllStafs = require("./services/getAllStafs");
const mailResetLink = require("./services/mailresetlink");
const resetPassword = require("./services/resetPassword");
const addUser = require("./services/addUser");
const serveImage = require("./services/serveImage");

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.url === "/api/register" && req.method === "POST") {
    return signup(req, res);
  } else if (req.url === "/api/login" && req.method === "POST") {
    return login(req, res);
  } else if (req.url === "/api/send-reset-link" && req.method === "POST") {
    return mailResetLink(req, res);
  } else if (req.url === "/api/reset-password" && req.method === "POST") {
    return resetPassword(req, res);
  } else if (req.url === "/api/allusers" && req.method === "GET") {
    return getAllStafs(req, res);
  } else if (req.url === "/api/add-user" && req.method === "POST") {
    return addUser(req, res);
  } else if (req.url.startsWith("/uploads/") && req.method === "GET") {
    return serveImage(req, res);
  }else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Route not found" }));
    res.end();
  }
});

const PORT = 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
