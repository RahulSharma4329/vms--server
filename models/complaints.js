const mongoose = require("mongoose");

const complaints = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  assignedto: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("complaints", complaints);
