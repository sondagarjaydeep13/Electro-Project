const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminSchema = new mongoose.Schema({
  uname: String,
  email: String,
  pass: String,
  date: {
    type: Date,
    default: Date.now(),
  },
  Tokens: [{ Token: String }],
});

adminSchema.pre("save", async function () {
  if (this.isModified("pass")) {
    this.pass = await bcrypt.hash(this.pass, 12);
  }
});
adminSchema.methods.generateToken = async function () {
  try {
    const Token = await jwt.sign({ _id: this._id }, process.env.ASKEY);
    this.Tokens = await this.Tokens.concat({ Token: Token });

    await this.save();
    return Token;
  } catch (error) {
    console.log(error);
  }
};
module.exports = mongoose.model("Admin", adminSchema);
