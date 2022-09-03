const mongoose = require("mongoose");

const Addata = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  officerlevel: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Addata", Addata);
