const express = require("express");
const router = express.Router();
const Admin = require("../model/Admin");
router.get("/admin", (req, res) => {
  res.render("adminlogin");
});
router.post("/addadmin", async (req, res) => {
  try {
    const admindata = await Admin(req.body).save();
    res.send(admindata);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
