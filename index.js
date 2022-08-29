const express = require("express");
require("dotenv/config");
const mongoose = require("mongoose");
const cred = require("./models/cred");
const port = process.env.PORT || 5000;
const cors = require("cors");

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

app.post("/register", async (req, res) => {
  try {
    const { username } = req.body;
    const { password } = req.body;

    const senddata = new cred({
      username: username,
      password: password,
    });

    const saveCred = await senddata.save();
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
