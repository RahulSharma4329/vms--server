const mongoose = require("mongoose");

const visitordata = new mongoose.Schema({
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
  purpose: {
    type: String,
    required: true,
  },
  apdate: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  apnumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("visitordata", visitordata);
