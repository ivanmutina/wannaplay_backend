import express from "express";
const router = express.Router();
const API = require("../controllers/api");
const multer = require("multer");

// multer middleware
let storage = multer.diskStorage({});

// rute
router.get("/", API.fecthAllPosts);
router.get("/:id", API.fecthPostByID);
router.post("/", API.createPost);
router.patch("/:id", API.updatePost);
router.delete("/:id", API.deletePost);

module.exports = router;
