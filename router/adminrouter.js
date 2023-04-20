const express = require("express");
const router = express.Router();
const Admin = require("../model/Admin");
const controller = require("../controller/usercontroller");
const adminauth = require("../middleware/adminauth");
router.get("/admin", (req, res) => {
  res.render("adminlogin");
});
router.get("/dashboard", adminauth, (req, res) => {
  res.render("dashboard");
});
router.get("/products", adminauth, (req, res) => {
  res.render("adminproducts");
});
router.get("/addproductpage", adminauth, (req, res) => {
  res.render("add-product");
});
router.get("/accounts", adminauth, (req, res) => {
  res.render("accounts");
});
router.get("/edit-product", adminauth, (req, res) => {
  res.render("edit-product");
});
router.post("/addadmin", async (req, res) => {
  try {
    const admindata = await Admin(req.body).save();
    res.send(admindata);
  } catch (error) {
    res.send(error);
  }
});
router.post("/adminlogin", async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  try {
    const { compare2, admindata } = await controller.adminbcrypt(email, pass);
    if (compare2 == true) {
      const Token = await admindata.generateToken();
      res.cookie("ajwt", Token);
      res.render("dashboard", {
        Admin: admindata.email,
        uname: admindata.email,
      });
    } else {
      res.render("adminlogin", {
        loginmsg: "Invalide user or password !!!",
      });
    }
  } catch (error) {
    res.render("adminlogin", { loginmsg: "Invalide user or password !!!" });
  }
});
router.get("/adminlogout", adminauth, async (req, res) => {
  const admin = req.admin;
  const token = req.token;
  try {
    admin.Tokens = await admin.Tokens.filter((e) => {
      return e.Token != token;
    });

    await admin.save();
    res.clearCookie("ajwt");
    res.render("adminlogin");
  } catch (error) {
    res.render("adminlogin", { loginmsg: "Error..!!pls login first !!!" });
  }
});
router.get("/adminlogoutall", adminauth, async (req, res) => {
  const admin = req.admin;
  const token = req.token;
  try {
    admin.Tokens = [];
    await admin.save();
    res.clearCookie("ajwt");
    res.render("adminlogin");
  } catch (error) {
    res.render("adminlogin", {
      loginmsg: "Invalide Token pls login first !!!",
    });
  }
});

module.exports = router;
