const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchem = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  city: String,
  phone: String,
  pass: String,
  date: {
    type: Date,
    default: Date.now(),
  },
  Tokens: [{ token: String }],
});

userSchem.pre("save", async function () {
  if (this.isModified("pass")) {
    this.pass = await bcrypt.hash(this.pass, 12);
  }
});
userSchem.methods.generateToken = async function (next) {
  const Token = await jwt.sign({ _id: this._id }, process.env.SKEY);
  this.Tokens = await this.Tokens.concat({ token: Token });
  await this.save();

  return Token;
  next();
};

const User = mongoose.model("User", userSchem);
module.exports = User;
