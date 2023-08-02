import Post from "../models/posts";

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
    const new_post = req.body;

    try {
      await Post.findByIdAndUpdate(id, new_post);
      res.status(200).json({ message: "Post updated successfully!" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // brisanje posta
  static async deletePost(req, res) {
    const id = req.params.id;
    try {
      const result = await Post.findByIdAndDelete(id);
      res.status(200).json({ message: "Post deleted successfully!" });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
};
