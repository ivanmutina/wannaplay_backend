import express from "express";
const router = express.Router();
const API = require("../controllers/api");
const multer = require("multer");

// multer middleware
let storage = multer.diskStorage({
  // sprema datoteke u mapu uploads
  destination: (req, file, cb) => {
    cb(null, "./uploads");
    // dodaj timestamp u naziv kako bi bio jedinstven
    filename: (req, file, cb) => {
      cb(null, file.originalname + "_" + Date.now());
    };
  },
});

let upload = multer({
  storage: storage,
}).single("image");

// rute
router.get("/", API.fecthAllPosts);
router.get("/:id", API.fecthPostByID);
router.post("/", upload, API.createPost);
router.patch("/:id", upload, API.updatePost);
router.delete("/:id", API.deletePost);

module.exports = router;
