const express = require("express");
const router = express.Router();
const User = require("../model/User");
const controller = require("../controller/usercontroller");
const jwt = require("jsonwebtoken");
const Product = require("../model/Adminproduct");
const auth = require("../middleware/auth");
router.get("/", async (req, res) => {
  const Token = req.cookies.jwt;

  try {
    const ProductData = await Product.find();
    if (Token) {
      res.render("index", { msglogout: "Logout", pdata: ProductData });
    } else {
      res.render("index", { msg: "My Account", pdata: ProductData });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/product", async (req, res) => {
  const Token = req.cookies.jwt;
  const ProductData = await Product.find();
  if (Token) {
    res.render("product", { msglogout: "Logout", pdata: ProductData });
  } else {
    res.render("product", { msg: "My Account", pdata: ProductData });
  }
});
router.get("/store", (req, res) => {
  const Token = req.cookies.jwt;
  if (Token) {
    res.render("store", { msglogout: "Logout" });
  } else {
    res.render("store", { msg: "My Account" });
  }
});
router.get("/cart", auth, (req, res) => {
  const Token = req.cookies.jwt;
  if (Token) {
    res.render("cart", { msglogout: "Logout" });
  } else {
    res.render("cart", { msg: "My Account" });
  }
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/userregister", async (req, res) => {
  try {
    const userdata = await User(req.body).save();
    res.render("register", { loginmsg: "User Registration success !!!" });
  } catch (error) {
    res.render(error);
  }
});
router.post("/userlogin", async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  try {
    const { compare1, userdata } = await controller.userbcrypt(email, pass);
    if (compare1 == true) {
      const Token = await userdata.generateToken();
      // console.log(Token);
      res.cookie("jwt", Token);
      res.render("index", {
        msglogout: "Logout",
        username: "Welcome" + "  " + userdata.fname,
        email: userdata.email,
        city: userdata.city,
      });
    } else {
      res.render("login", { loginmsg: "Invalide user or Password !!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", auth, async (req, res) => {
  const userdata = req.user;
  const Token = req.token;

  try {
    userdata.Tokens = await userdata.Tokens.filter((e) => {
      return e.token != Token;
    });
    await userdata.save();
    res.clearCookie("jwt");
    res.render("index", { msg: "My Account" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
