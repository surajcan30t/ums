require("dotenv").config();
const Cookies = require("cookies");
const db = require("../db");
const jwt = require("jsonwebtoken");

const SERVER_URL = "http://localhost:8000";

const getAllStafs = async (req, res) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");
  
  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Unauthorized" }));
    res.end();
    console.log("Unauthorized");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Forbidden" }));
      res.end();
      return;
    }

    const [staffs] = await db.query("SELECT id, name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, password, profile_picture FROM staff");

    const staffWithImageUrls = staffs.map((staff) => ({
      ...staff,
      profile_picture: staff.profile_picture
        ? `${SERVER_URL}/uploads/${staff.profile_picture}`
        : null,
    }));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(staffWithImageUrls));
    res.end();
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Internal server error" }));
    res.end();
  }
}

module.exports = getAllStafs;