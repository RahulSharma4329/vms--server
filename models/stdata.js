const mongoose = require("mongoose");

const Stdata = new mongoose.Schema({
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
  roll: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  hostelname: {
    type: String,
    required: true,
  },
  roomno: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Stdata", Stdata);
