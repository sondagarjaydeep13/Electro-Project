const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  pid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Cart", cartSchema);
