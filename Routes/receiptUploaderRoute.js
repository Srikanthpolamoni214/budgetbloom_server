const {upload, receiptUpload} = require("../Controllers/receiptUploderController");

const route = require("express").Router();

route.post(
  "/receipts",
  upload.single("receipt"),
  receiptUpload



);

module.exports = route;
