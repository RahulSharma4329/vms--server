const express = require("express");
require("dotenv/config");
const mongoose = require("mongoose");
const cred = require("./models/cred");
const port = process.env.PORT || 5000;
const cors = require("cors");
const stdata = require("./models/stdata");
const addata = require("./models/addata");

const app = express();
mongoose.connect(process.env.DB_CONNECTION, () => {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

router = express.Router();

app.get("/", (req, res) => {
  res.send("HMS_API is live");
});

app.post("/adregister", async (req, res) => {
  try {
    const { username } = req.body;
    const { password } = req.body;
    const { role } = req.body;
    const { name } = req.body;
    const { phone } = req.body;
    const {officerlevel} = req.body;

    const senddata = new cred({
      username: username,
      password: password,
      role: role,
    });
    const sendaddata = new addata({
      name: name,
      email: username,
      phone: phone,
      officerlevel:officerlevel,
    })

    const saveCred = await senddata.save();
    const saveaddata = await sendaddata.save();
    res.status(200).json({ success: true, data: saveaddata });
  } catch (error1) {
    res.status(400).json({ success: false, data: [], error: error1 });
  }
});

app.post("/stregister", async (req, res) => {
  try {
    const { username } = req.body;
    const { password } = req.body;
    const { role } = req.body;
    const { name } = req.body;
    const { phone } = req.body;
    const { roll } = req.body;
    const { year } = req.body;
    const { branch } = req.body;
    const { hostelname } = req.body;
    const { roomno } = req.body;

    const senddata = new cred({
      username: username,
      password: password,
      role: role,
    });

    const sendstdata = new stdata({
      name: name,
      email: username,
      phone: phone,
      roll: roll,
      branch: branch,
      year: year,
      hostelname: hostelname,
      roomno: roomno,
    });

    const saveCred = await senddata.save();
    const savestdata = await sendstdata.save();
    res.status(200).json({ success: true, data: saveCred });
  } catch (error1) {
    res.status(400).json({ success: false, data: [], error: error1 });
  }
});

app.post("/login", async (req, res) => {
  try {
    const recdata = await cred.find({
      username: req.body.username,
      password: req.body.password,
    });
    res.status(200).json({ success: true, data: recdata });
  } catch (error) {
    res.status(400).json({ success: false, data: [], error: error });
  }
});

app.listen(port, () => {
  console.log("Server running on port 5000....");
});
