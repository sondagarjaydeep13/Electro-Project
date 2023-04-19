const jwt = require("jsonwebtoken");
const User = require("../model/User");
const auth = async (req, res, next) => {
  const Token = req.cookies.jwt;
  try {
    const isVerify = await jwt.verify(Token, process.env.SKEY);
    const userdata = await User.findOne({ _id: isVerify._id });
    if (isVerify) {
      req.user = userdata;
      req.token = Token;
      console.log(Token);
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
