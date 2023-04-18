const bcrypt = require("bcryptjs");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const verify = async (email, pass) => {
  const userdata = await User.findOne({ email: email });
  const compare = await bcrypt.compare(pass, userdata.pass);
  return { compare, userdata };
};

module.exports = { verify };
