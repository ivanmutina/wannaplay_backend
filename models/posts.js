import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  date: String,
  time: String,
  place: String,
  players: Number,
  gender: String,
  contact: Number,
  description: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
