const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

const serveImage = (req, res) => {
  const filePath = path.join(uploadDir, req.url.replace("/uploads/", ""));

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Image not found" }));
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = "image/jpeg";

    if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".gif") contentType = "image/gif";

    res.writeHead(200, { "Content-Type": contentType });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
};

module.exports = serveImage;
