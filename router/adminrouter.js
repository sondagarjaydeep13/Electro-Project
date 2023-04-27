const express = require("express");
const router = express.Router();
const Admin = require("../model/Admin");
const controller = require("../controller/usercontroller");
const AdminProduct = require("../model/Adminproduct");
const multer = require("multer");
const adminauth = require("../middleware/adminauth");

//*********************** image upload multor*********************** */
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/img1");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_ " + file.originalname);
  },
});
const upload = multer({ storage: storage });
//************************** end************************************ */

router.get("/admin", (req, res) => {
  res.render("adminlogin");
});
router.get("/dashboard", adminauth, (req, res) => {
  res.render("dashboard");
});
router.get("/products", adminauth, async (req, res) => {
  try {
    const Product = await AdminProduct.find();

    res.render("adminproducts", { pdata: Product });
    // console.log(Product);
  } catch (error) {
    console.log(error);
  }
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
router.post("/addproduct", upload.single("file"), async (req, res) => {
  const id = req.body.id;
  // console.log(id);

  try {
    if (id == undefined) {
      const addproduct = await AdminProduct({
        pname: req.body.pname,
        qty: req.body.qty,
        price: req.body.price,
        description: req.body.description,
        img: req.file.filename,
      });

      await addproduct.save();

      res.send(addproduct.pname + " " + "Product Added Success !!!");
    } else {
      await AdminProduct.findByIdAndUpdate(id, {
        pname: req.body.pname,
        qty: req.body.qty,
        price: req.body.price,
        description: req.body.description,
        img: req.file.filename,
      });
      res.send("Product Update Success !!!");
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/deleteproduct", async (req, res) => {
  const _id = req.query.did;
  try {
    await AdminProduct.findByIdAndDelete(_id);
    const Product = await AdminProduct.find();
    res.render("adminproducts", { pdata: Product });
  } catch (error) {
    console.log(error);
  }
});
router.get("/editproduct", async (req, res) => {
  const _id = req.query.eid;

  try {
    const editproduct = await AdminProduct.findById(_id);
    res.render("edit-product", { edata: editproduct });
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
