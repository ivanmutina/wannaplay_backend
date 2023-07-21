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
    res.send("Fetch post by ID");
  }
  // kreiranje posta
  static async createPost(req, res) {
    const post = req.body;
    const imageName = req.file.filename;
    post.image = imageName;

    try {
      await Post.create(post);
      res.status(201).json({ message: "Post created successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  // ažuriranje posta
  static async updatePost(req, res) {
    res.send("Update a post");
  }
  // brisanje posta
  static async deletePost(req, res) {
    res.send("Delete a post");
  }
};
