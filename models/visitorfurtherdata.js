const mongoose = require("mongoose");

const visitordata = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  Country: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  vdetails: {
    type: String,
    required: true,
  },
  ddetails: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("visitordata", visitordata);
