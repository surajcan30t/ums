require("dotenv").config();
const Cookies = require("cookies");
const db = require("../db");
const jwt = require("jsonwebtoken");

const getAllStafs = async (req, res) => {
  console.log("Get all staffs called");
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");
  
  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Unauthorized" }));
    res.end();
    console.log("Unauthorized");
    return;
  }
  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    if (decoded.role !== "admin") {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Forbidden" }));
      res.end();
      return;
    }

    const [staffs] = await db.query("SELECT id, name, DATE_FORMAT(dob, '%Y-%m-%d') AS dob, password, profile_picture FROM staff");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(staffs));
    res.end();
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Internal server error" }));
    res.end();
  }
}


// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Cookies = require("cookies");
// const db = require("../db"); // Ensure this points to your database connection file

// const getAllStafs = async (req, res) => {
//   const cookies = new Cookies(req, res);
//   const token = cookies.get("token");

//   if (!token) {
//     res.writeHead(401, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ message: "Unauthorized" }));
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role !== "admin") {
//       res.writeHead(403, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ message: "Forbidden" }));
//       return;
//     }

//     // Generate random user data
//     const randomName = `User_${Math.floor(Math.random() * 10000)}`;
//     const randomDob = new Date(
//       1950 + Math.floor(Math.random() * 50),
//       Math.floor(Math.random() * 12),
//       Math.floor(Math.random() * 28) + 1
//     )
//       .toISOString()
//       .split("T")[0]; // YYYY-MM-DD format

//     const randomPassword = `pass_${Math.random().toString(36).substring(2, 8)}`;
//     const hashedPassword = await bcrypt.hash(randomPassword, 10);
//     const profilePicture = `https://api.dicebear.com/7.x/initials/svg?seed=${randomName}`;

//     // Insert into database
//     const [result] = await db.query(
//       "INSERT INTO staff (name, dob, password, profile_picture) VALUES (?, ?, ?, ?)",
//       [randomName, randomDob, hashedPassword, profilePicture]
//     );

//     if (result.affectedRows > 0) {
//       res.writeHead(201, { "Content-Type": "application/json" });
//       res.end(
//         JSON.stringify({
//           message: "Random staff added successfully",
//           staff: {
//             id: result.insertId,
//             name: randomName,
//             dob: randomDob,
//             password: randomPassword, // Send unhashed password only for testing (remove this in production)
//             profile_picture: profilePicture,
//           },
//         })
//       );
//     } else {
//       res.writeHead(500, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ message: "Failed to insert staff" }));
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     res.writeHead(500, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ message: "Internal server error" }));
//   }
// };

module.exports = getAllStafs;
