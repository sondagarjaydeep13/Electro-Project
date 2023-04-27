const bcrypt = require("bcryptjs");
const User = require("../model/User");
const Product = require("../model/Adminproduct");
const Admin = require("../model/Admin");
const Whishlist = require("../model/Whishlist");
const Cart = require("../model/Cart");
const router = require("../router/userrouter");
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

const ProductData = async () => {
  const Products = await Product.find();
  return Products;
};

const findwhishlist = async (uid) => {
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
    return whishlistdata;
  } catch (error) {
    console.log(error);
  }
};
const findproduct = async (uid, pid) => {
  try {
    const cartdata = await Cart({
      uid: uid,
      pid: pid,
    });
    await cartdata.save();
    return cartdata;
  } catch (error) {
    console.log(error);
  }
};

const findcart = async (uid) => {
  try {
    const cartproduct = await Cart.aggregate([
      {
        $match: { uid: uid },
      },
      {
        $lookup: {
          from: "adminproducts",
          localField: "pid",
          foreignField: "_id",
          as: "Carts",
        },
      },
    ]);
    const usercart = [];
    for (var i = 0; i < cartproduct.length; i++) {
      usercart.push(...cartproduct[i].Carts);
    }
    return usercart;
  } catch (error) {
    console.log(error);
  }
};
const allproduct = async () => {
  try {
    const allProduct = await Product.find();
    return allProduct;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  userbcrypt,
  adminbcrypt,
  ProductData,
  findwhishlist,
  findproduct,
  findcart,
  allproduct,
};
