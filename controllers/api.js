import Post from "../models/posts";
const fs = require("fs"); // fs modul nodejs-a

module.exports = class API {
  // dohvati (fetch) sve postove
  static async fecthAllPosts(req, res) {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // dohvati post po ID-u
  static async fecthPostByID(req, res) {
    // dohvati id iz url-a
    const id = req.params.id;
    try {
      const post = await Post.findById(id);
      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // kreiranje posta
  static async createPost(req, res) {
    const post = req.body;
    const image_name = req.file.filename;
    post.image = image_name;

    try {
      await Post.create(post);
      res.status(201).json({ message: "Post created successfully!" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // ažuriranje posta
  static async updatePost(req, res) {
    // dohvati id iz url-a
    const id = req.params.id;
    let new_image = "";

    if (req.file) {
      // ako mijenjamo samo sliku
      new_image = req.file.filename;
      try {
        fs.unlinkSync("./uploads/" + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      // ako ne zelimo mijenjati sliku (nova slika = stara slika)
      new_image = req.body.old_image;
    }

    // sad nastavim dalje s mijenjanjem
    const new_post = req.body;
    new_post.image = new_image;

    try {
      await Post.findByIdAndUpdate(id, new_post);
      res.status(200).json({ message: "Post updated successfully!" });
    } catch (error) {
      res.status(404).json({ message: err.message });
    }
  }

  // brisanje posta
  static async deletePost(req, res) {
    const id = req.params.id;
    try {
      const result = await Post.findByIdAndDelete(id);
      // da obrise i sliku
      if (result.image != "") {
        try {
          fs.unlinkSync("./uploads/" + result.image);
        } catch (err) {
          console.log(err);
        }
      }
      res.status(200).json({ message: "Post deleted successfully!" });
    } catch (error) {
      res.status(404).json({ message: err.message });
    }
  }
};
