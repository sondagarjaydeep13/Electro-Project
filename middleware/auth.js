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
      // console.log(Token);
      next();
    } else {
      res.render("login", { loginmsg: "Pls login here" });
    }
  } catch (error) {
    res.render("login", { loginmsg: "Pls login here" });
  }
};

module.exports = auth;
