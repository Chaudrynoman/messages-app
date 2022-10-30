const mongoose = require("mongoose");
const posts = new mongoose.Schema({
  date: {type: String},
  key: {type: String},
  message: {type: Array},
});
module.exports.postsSchema = mongoose.model("posts", posts, "posts");