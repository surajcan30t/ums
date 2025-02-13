require("dotenv").config();
const http = require("http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const Cookies = require("cookies");

const resetPassword = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    const { resetToken, password } = JSON.parse(body);
    if (!resetToken || !password) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Insufficient Data" }));
    }
    try{
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
      const { mail, exp } = decoded;

      const [user] = await db.query("SELECT reset_token, reset_token_expires FROM users WHERE email = ?", [mail]);

      if(user.length === 0){
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid or expired token" }));
      }

      const isValidTokenAndTime = user[0].reset_token === resetToken && new Date(exp * 1000) <= user[0].reset_token_expires;

      if(!isValidTokenAndTime){
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid or expired token" }));
      }

      const hash = await bcrypt.hash(password, 10);

      const [result] = await db.query("UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?", [hash, mail]);

      if (result.affectedRows === 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Password reset failed" }));
      }

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Password reset successful" }));
    }catch(e){
      console.log("inside catch")
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid or expired token" }));
    }
  });
};

module.exports = resetPassword;