const express = require("express");
require("dotenv/config");
const mongoose = require("mongoose");
const cred = require("./models/cred");
const port = process.env.PORT || 5000;
const cors = require("cors");
const stdata = require("./models/stdata");
const addata = require("./models/addata");
const complaints = require("./models/complaints");
const visitordata = require("./models/vistior");
const nodemailer = require("nodemailer");

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

function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

async function sendemail(recipientEmail, link, name) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "sem6sectioncvms@gmail.com", // Your email address
      pass: "mdlxbnxjzrysbdju", // Your email password
    },
  });
  try {
    await transporter.sendMail({
      from: "sem6sectioncvms@gmail.com", // Your email address
      to: recipientEmail,
      subject: "New Request for Visit",
      html: `
        <h1>There is a new request for a visit from ${name}</h1>
        <p> Click the button to open pending requests:</p>
        <a href="${link}">
          <button>Go to Pending Requests</button>
        </a>
      `,
    });
    return true;
  } catch (error) {
    return false;
  }
}

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
    const { officerlevel } = req.body;

    const senddata = new cred({
      username: username,
      password: password,
      role: role,
    });
    const sendaddata = new addata({
      name: name,
      email: username,
      phone: phone,
      officerlevel: officerlevel,
    });

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

app.post("/register", async (req, res) => {
  try {
    const { username } = req.body;
    const { password } = req.body;
    const { role } = req.body;
    const { name } = req.body;
    const { phone } = req.body;

    const senddata = new cred({
      username: username,
      password: password,
      role: role,
      name: name,
      phone: phone,
    });

    const recdata = await cred.find({
      username: req.body.username,
      password: req.body.password,
    });
    if (recdata.length != 0) {
      res.status(200).json({ success: false, msg: "User already exists !" });
    } else {
      const saveCred = await senddata.save();
      res.status(200).json({ success: true, data: saveCred });
    }
  } catch (error1) {
    res.status(400).json({ success: false, data: [], error: error1 });
  }
});

app.post("/storecomplaints", async (req, res) => {
  try {
    const { username, complaintbody } = req.body;
    const query = new complaints({
      name: username,
      complaint: complaintbody,
      assignedto: "1",
      status: "open",
    });
    const savecomplaintdeeet = await query.save();
    res.status(200).json({ success: true, data: savecomplaintdeeet });
  } catch (error) {
    res.status(400).json({ success: false, data: {} });
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

app.post("/fetchdets", async (req, res) => {
  const { role } = req.body;

  try {
    if (role === "student") {
      const getdata = await stdata.find({
        email: req.body.username,
      });
      res.status(200).json({ success: true, data: getdata });
    } else if (role === "admin") {
      const getdata = await addata.find({
        email: req.body.username,
      });
      res.status(200).json({ success: true, data: getdata });
    }
  } catch (error) {
    res.status(400).json({ success: false, data: [], error: error });
  }
});

app.post("/savevisitappointment", async (req, res) => {
  const { name, email, phone, date, purpose, address, country, city } =
    req.body;
  const last_entry = await visitordata.find().sort({ _id: -1 }).limit(1);
  console.log("this is last entry", last_entry);
  let newappnumber = 1;
  if (last_entry.length == 0) {
    newappnumber = 0;
  } else {
    newappnumber = parseInt(parseInt(last_entry[0].appnumber) + 1);
  }
  try {
    const query = new visitordata({
      name: name,
      email: email,
      phone: phone,
      date: date,
      purpose: purpose,
      address: address,
      country: country,
      city: city,
      appnumber: newappnumber,
    });

    // console.log(query);
    const savedata = await query.save();
    const emailresp = await sendemail(email, "https://www.vms.com", name);
    console.log(emailresp);
    res.status(200).json({ success: true, data: savedata });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, data: [], error: error });
  }
});

app.listen(port, () => {
  console.log("Server running on port 5000....");
});
