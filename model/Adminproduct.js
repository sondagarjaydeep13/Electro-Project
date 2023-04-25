const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pname: String,
  qty: Number,
  price: Number,
  description: String,
  img: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("AdminProduct", productSchema);
