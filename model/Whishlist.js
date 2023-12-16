const mongoose = require("mongoose");

const whishSchema = new mongoose.Schema({
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("wishlist", whishSchema);
