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
const visitorfurtherdata = require("./models/visitorfurtherdata");
var bodyParser = require("body-parser");

const app = express();
app.use(cors());
mongoose.connect(process.env.DB_CONNECTION, () => {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(express.json());
app.use(express.urlencoded({ limit: "100mb", extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));

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

async function sendemail2(recipientEmail, status, link) {
  let body;
  console.log("sending emailto ", recipientEmail);
  if (status == "closed") {
    status = "accepted";
    body = `
        <h1> your request has been ${status}</h1>
        <p>please fill out this form for further details</p>
        <a href="${link}">
          <button>Fill out form</button>
        </a>
      `;
  } else {
    body = `
        <h1> your request has been ${status}</h1>
      `;
  }
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
      subject: "Response for Inquiry OF Visit",
      html: body,
    });
    return true;
  } catch (error) {
    return false;
  }
}
async function sendemailwithqr(recipientEmail, status, qrcode, apnum) {
  let body;
  console.log(recipientEmail);
  if (status == "approved") {
    body = `
        <h1> your request has been approved completely and we cannot wait to have you with us.</h1>
        <h3>This is the QR Code for getting access</h3>
        <img src = ${qrcode}/>
        <p>your appointment number is ${apnum}</p> 
      `;
  } else {
    body = `
        <h1> your request has been ${status}</h1>
      `;
  }
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
      subject: "Response for Inquiry OF Visit",
      html: body,
    });
    return true;
  } catch (error) {
    console.log(error);
    return error;
  }
}

app.get("/", (req, res) => {
  res.send("VMS_API is live");
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

app.post("/getprequests", async (req, res) => {
  try {
    const reqdata = await visitordata.find({ status: "open" });
    res.status(200).json({
      success: true,
      data: reqdata,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
    });
  }
});

app.post("/getarequests", async (req, res) => {
  try {
    const reqdata = await visitordata.find({ status: "active" });
    res.status(200).json({
      success: true,
      data: reqdata,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
    });
  }
});

app.post("/getsrequests", async (req, res) => {
  try {
    const reqdata = await visitordata.find({ status: "scanned" });
    res.status(200).json({
      success: true,
      data: reqdata,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
    });
  }
});

app.post("/getmoredata", async (req, res) => {
  const id = req.body;
  console.log(id);
  try {
    const reqdata = await visitorfurtherdata.find({ appid: id.id });
    res.status(200).json({
      success: true,
      data: reqdata,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      error: error,
    });
  }
});

app.post("/savevisitappointment", async (req, res) => {
  const { name, email, phone, date, purpose, address, country, city, status } =
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
      status: status,
    });

    // console.log(query);
    const savedata = await query.save();
    const emailresp = await sendemail(
      "rahulsharma4329@gmail.com",
      "https://deluxe-cuchufli-2f0da8.netlify.app/dashboard",
      name
    );
    console.log(emailresp);
    res.status(200).json({ success: true, data: savedata });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, data: [], error: error });
  }
});

app.post("/approvereq", async (req, res) => {
  const { id, email } = req.body;
  console.log(id);
  try {
    visitordata.updateOne(
      { _id: id },
      { status: "closed" },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Docs : ", docs);
        }
      }
    );
    const emailresp = await sendemail2(
      email,
      "closed",
      "https://deluxe-cuchufli-2f0da8.netlify.app/response/?id=" + id
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error,
    });
  }
});

app.post("/rejectreq", async (req, res) => {
  const { id, email } = req.body;
  console.log(id);
  try {
    visitordata.updateOne(
      { _id: id },
      { status: "rejected" },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Docs : ", docs);
        }
      }
    );
    const emailresp = await sendemail2(
      email,
      "rejected",
      "we could not approve your request for a visit"
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error,
    });
  }
});

app.post("/savefurtherdata", async (req, res) => {
  let apnum;
  const {
    cname,
    country,
    photo,
    vehicle,
    device,
    devicetype,
    deviceserial,
    wifi,
    appid,
    qrcode,
  } = req.body;

  const savequery = new visitorfurtherdata({
    company: cname,
    Country: country,
    Image: photo,
    vdetails: vehicle,
    device: device,
    devicetype: devicetype,
    deviceserial: deviceserial,
    wifi: wifi,
    appid: appid,
    qrcode: qrcode,
  });

  try {
    visitordata.updateOne(
      { _id: appid },
      { status: "active" },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Docs : ", docs);
        }
      }
    );
    const saving = await savequery.save();

    const checkdata = await visitordata.find({ _id: appid });
    apnum = appid;
    let email = checkdata[0].email;
    console.log(email);
    const emailresp = await sendemailwithqr(email, "approved", qrcode, apnum);
    res.status(200).json({ success: false, data: saving });
  } catch (error) {
    res.status(400).json({ success: false, data: apnum, error: error });
  }
});

app.post("/updateqrinfo", async (req, res) => {
  const { id } = req.body;
  try {
    visitordata.updateOne(
      { _id: id },
      { status: "scanned" },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("Updated Docs : ", docs);
        }
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(200).json({ success: true, error: error });
  }
});

app.listen(port, () => {
  console.log("Server running on port 5000....");
});
