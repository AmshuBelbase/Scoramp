const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  full_name: String,
  reg_id: String,
  phone: Number,
  field: String,
  address: String,
  email: String,
  password: String,
});
const User = new mongoose.model("User", userSchema);
module.exports = User;
