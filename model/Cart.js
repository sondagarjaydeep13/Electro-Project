const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Cart", cartSchema);
