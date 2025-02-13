require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const Cookies = require("cookies");

const deleteUser = async (req, res) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");

  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Unauthorized" }));
    res.end();
    console.log("Unauthorized");
    return;
  }
  const id = parseInt(req.url.split("/").reverse()[0]);
  console.log(typeof id)
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Unauthorized" }));
      res.end();
      return;
    }
    const result = await db.query("DELETE FROM staff WHERE id = ?", id);
    if (result[0]?.affectedRows === 1) {
      console.log('if block')
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "User deleted" }));
      res.end();
      return;
    }else{
      console.log('else block')
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "User not found" }));
      res.end();
    }
  } catch (error) {
    console.log(error)
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "An error occurred" }));
    res.end();
  }
};

module.exports = deleteUser;
