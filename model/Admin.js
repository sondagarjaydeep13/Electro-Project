const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  uname: String,
  email: String,
  pass: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Admin", adminSchema);
