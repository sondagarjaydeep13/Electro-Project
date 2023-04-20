const bcrypt = require("bcryptjs");
const User = require("../model/User");

const Admin = require("../model/Admin");
const userbcrypt = async (email, pass) => {
  const userdata = await User.findOne({ email: email });

  const compare1 = await bcrypt.compare(pass, userdata.pass);

  return { compare1, userdata };
};
const adminbcrypt = async (email, pass) => {
  const admindata = await Admin.findOne({ email: email });

  const compare2 = await bcrypt.compare(pass, admindata.pass);
  return { compare2, admindata };
};

module.exports = { userbcrypt, adminbcrypt };
