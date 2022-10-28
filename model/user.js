const mongoose = require("mongoose");
const user = new mongoose.Schema({
  id: {type: String},
  name: {type: String},
  email: {type: String},
  password:{type: String},
})

module.exports.userSchema = mongoose.model("user", user, "user");