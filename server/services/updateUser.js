require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const Cookies = require("cookies");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const updateUser = async (req, res) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");

  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Unauthorized" }));
    res.end();
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (!user) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Unauthorized" }));
    }

    upload.single("profilePicture")(req, res, async (err) => {
      if (err) {
        console.error(err)
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "File upload error" }));
      }

      const updateFields = { ...req.body };
      if (req.file) {
        updateFields.profile_picture = req.file.filename;
      }

      console.log('updatefields', updateFields);

      const [result] = await db.query("UPDATE staff SET ? WHERE id = ?", [
        updateFields,
        parseInt(updateFields.id),
      ]);

      console.log('result', result)

      if (result.affectedRows > 0) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User updated successfully" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User not found" }));
      }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
};

module.exports = updateUser;
