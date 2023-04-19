const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin");
const adminauth = async (req, res, next) => {
  const Token = req.cookies.ajwt;

  try {
    const TokenVerify = await jwt.verify(Token, process.env.ASKEY);
    if (TokenVerify) {
      const admindata = await Admin.findOne({ _id: TokenVerify._id });

      req.admin = admindata;
      req.token = Token;
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = adminauth;
