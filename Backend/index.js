const express = require("express");
const multer = require("multer");
const cors = require("cors");
const docxToPDF = require("docx-pdf");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());

// settting up the file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/convertFile", upload.single("file"), (req, res, next) => {
  console.log("hit route 1");
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file  uploaded",
      });
    }
    console.log("hit route 2");
    // Defining outout file path
    let outoutPath = path.join(
      __dirname,
      "files",
      `${req.file.originalname}.pdf`
    );
    console.log("hit route 3");
    docxToPDF(req.file.path, outoutPath, (err, result) => {
      console.log("hit route 6");
      if (err) {
        console.log("hit route 7");
        console.log(err);
        return res.status(500).json({
          message: "Error converting docx to pdf",
        });
      }
      console.log("hit route 8");
      res.download(outoutPath, () => {
        console.log("hit route 9");
        console.log("file downloaded");
      });
    });
    console.log("hit route 4");
  } catch (error) {
    console.log("hit route 5");
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port} new 1`);
});
