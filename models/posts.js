import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  category: String,
  content: String,
  image: String,
  created: {
    type: Date,
    defautl: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
