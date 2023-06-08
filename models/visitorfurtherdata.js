const mongoose = require("mongoose");

const visitorfurtherdata = new mongoose.Schema({
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
  device: {
    type: String,
    required: true,
  },
  devicetype: {
    type: String,
    required: true,
  },
  deviceserial: {
    type: String,
    required: true,
  },
  wifi: {
    type: String,
    required: true,
  },
  appid: {
    type: String,
    required: true,
  },
  qrcode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("visitorfurtherdata", visitorfurtherdata);
