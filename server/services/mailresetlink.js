require("dotenv").config();
const mailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sendMail = async (receiver, token) => {
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASS,
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/auth/resetpassword/${token}`;

  const message = `
    <p>You requested for a password reset.</P>
    <P>Click <a target="_blank" href="${resetLink}">here</a> to reset your password.</p>
  `;
  const mailOptions = {
    from: process.env.MAIL,
    to: receiver,
    subject: "Password Change Request",
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: info.messageId };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const randomResetToken = (email) => {
  const token = jwt.sign(
    { mail: email, purpose: "Password reset request" },
    process.env.JWT_SECRET,
    {
      expiresIn: '10min',
    }
  );
  const {exp} = jwt.decode(token);
  return {token, exp};
};

const mailResetLink = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    const { email } = JSON.parse(body);
    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Insufficient Data" }));
    }
    const db = require("../db");
    try {
      const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (users.length === 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid email" }));
        return;
      }

      const {token, exp} = randomResetToken(email);
      const expiresAt = new Date(exp * 1000);

      const [result] = await db.query(
        "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
        [token, expiresAt, email]
      );

      const isMailSentSuccessFully = (await sendMail(email, token))
        .success;

      if (!isMailSentSuccessFully || !(result.affectedRows > 0)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Unable to send mail" }));
      } else {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Reset link sent successfully" }));
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

module.exports = mailResetLink;
