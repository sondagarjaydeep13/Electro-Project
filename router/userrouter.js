const express = require("express");
const router = express.Router();
const User = require("../model/User");
const controller = require("../controller/usercontroller");
const jwt = require("jsonwebtoken");
const Product = require("../model/Adminproduct");
const auth = require("../middleware/auth");
// const wishList = require("../model/Whishlist");
const Adminproduct = require("../model/Adminproduct");
const Whishlist = require("../model/Whishlist");
const Cart = require("../model/Cart");
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
router.get("/cart", auth, async (req, res) => {
  const Token = req.cookies.jwt;
  const uid = req.user._id;
  // console.log(uid);
  if (Token) {
    const resultcart = await controller.findcart(uid);

    res.render("cart", { msglogout: "Logout", ucart: resultcart });
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
router.get("/viewwhishlist", auth, async (req, res) => {
  const uid = req.user;
  // console.log(uid);
  try {
    const listdata = await Whishlist.aggregate([
      { $match: { uid: uid._id } },
      {
        $lookup: {
          from: "adminproducts",
          localField: "pid",
          foreignField: "_id",
          as: "Products",
        },
      },
    ]);
    const whishlistdata = [];

    for (var i = 0; i < listdata.length; i++) {
      whishlistdata.push(...listdata[i].Products);
    }
    // console.log(whishlistdata);
    res.render("whishlist", { wdata: whishlistdata, msglogout: "Logout" });
  } catch (error) {
    console.log(error);
  }
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
      const Products = await controller.ProductData();
      const Token = await userdata.generateToken();

      // console.log(Token);
      res.cookie("jwt", Token);
      res.render("index", {
        msglogout: "Logout",
        username: "Welcome" + "  " + userdata.fname,
        email: userdata.email,
        city: userdata.city,
        pdata: Products,
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
    const allProduct = await controller.allproduct();

    res.redirect("/", 302, { msg: "My Account", pdata: allProduct });
  } catch (error) {
    console.log(error);
  }
});
router.get("/addwhishlist", auth, async (req, res) => {
  const pid = req.query.pid;
  const uid = req.user;

  try {
    const WishListItem = new Whishlist({ pid, uid });
    await WishListItem.save();
    res.send("Item added To wish List");
  } catch (error) {
    console.log(error);
  }
});
router.get("/whishdelete", auth, async (req, res) => {
  const pid = req.query.did;
  const uid = req.user._id;
  // console.log(uid);
  // console.log(id);
  try {
    await Whishlist.deleteOne({ pid: pid, uid: uid });
    const result = await controller.findwhishlist(uid);
    res.render("whishlist", { wdata: result });
  } catch (error) {
    console.log(error);
  }
});
router.get("/addtocart", auth, async (req, res) => {
  const pid = req.query.pid;
  const uid = req.user._id;
  // console.log(id + " " + uid);

  try {
    const cart = await controller.findproduct(uid, pid);
    res.send("Product Added To Cart Success");
    // console.log(cart);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
