
const fs = require("fs")
const path = require("path")
const multer = require('multer');
const fsAsync = fs.promises;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
cb(null, path.join(__dirname, "uploads"));
  },
  // filename: function (req, file, cb) {
  //   cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
  // },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
  // cb(null, file.originalname); // Use original filename
}

});

const upload = multer({ storage: storage });
 



 const exists = async () => {
  try {
    // Check if the directory exists with the correct path
    await fsAsync.access(path.resolve(__dirname, "uploads"));
  } catch (err) {
    // If it doesn't exist, create it
    if (err.code == "ENOENT") {
      await fsAsync.mkdir(path.resolve(__dirname, "uploads"));
      console.log("Uploads directory created!");
    } else {
      console.error("Error checking directory:", err);
    }
  }
};

// Call the exists function
exists();


const receiptUpload = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Send back the actual saved filename
    res.status(200).json({
      message: "File uploaded successfully",
      filename: file.filename, // ✅ Use this for future file access
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports  = { upload, receiptUpload };
