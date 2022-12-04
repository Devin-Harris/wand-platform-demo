const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Express endpoints setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
app.use(
  cors(
    {
      origin: true,
      credentials: true,
    }
  )
);
app.use(express.static("server_html"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to mongoose db
const uri = `mongodb+srv://admin:${encodeURI(
  process.env.MONGO_ATLAS_PASSWORD
)}@main-cluster.i56mk.mongodb.net/${encodeURI(
  process.env.MONGO_ATLAS_DB
)}?retryWrites=true&w=majority`;
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (error) {
    if (error) console.log(error);
    else console.log("Connected to DB");
  }
);

// App middleware
app.use(function (req, res, next) {
  // Request methods you wish to allow
  console.log(req.headers.origin)
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Set ip of request to local variable
  res.locals.ip = req.headers["x-forwarded-for"]
    ? req.headers["x-forwarded-for"].split(",").shift()
    : req.socket.remoteAddress;
  // Pass to next layer of middleware
  next();
});

// Default route to log when connected to db
app.get("/", (req, res) => {
  console.log("Route / recieved");
  res.send("Connected");
});

// Login to editor
app.post("/editor-login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.MONGO_ATLAS_PASSWORD) {
    res.cookie("password", password, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
    res.send({ ok: true, message: "Successfully logged into editor" });
  } else {
    res
      .status(400)
      .send({ ok: false, message: "Unsuccessfully logged into editor" });
  }
});

// Login to editor
app.get("/auth-check", (req, res) => {
  if (req.cookies.password === process.env.MONGO_ATLAS_PASSWORD) {
    res.send({ ok: true, message: "Already successfully logged into editor" });
  } else {
    res.send({
      ok: false,
      message: "Have not already successfully logged into editor",
    });
  }
});

// Routes
const router = express.Router();
const getters = require("./routes/getters");
const setters = require("./routes/setters");
const mutators = require("./routes/mutators");
app.use(router.use("/", getters));
app.use(router.use("/", setters));
app.use(router.use("/", mutators));

// Translation Routes
const { Translate } = require("@google-cloud/translate").v2;
const translate = new Translate({
  projectId: JSON.parse(process.env.GOOGLE_JSON_KEY).project_id,
  credentials: JSON.parse(process.env.GOOGLE_JSON_KEY),
});

app.post("/translate", (req, res) => {
  const { text, options } = req.body;
  translate
    .translate(text, options)
    .then((results) => {
      const translation = results[0];
      res.status(200).send({
        text,
        translation,
        detectedSourceLanguage:
          options.from || text === ""
            ? null
            : results[1].data.translations[0].detectedSourceLanguage,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});
app.get("/languages", (req, res) => {
  translate
    .getLanguages()
    .then((languages) => {
      res.status(200).send(languages[0]);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Email setup
const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
app.post("/form-submission", async (req, res) => {
  const {
    name,
    email,
    telephone,
    occupation,
    yearsEmployed,
    annualIncome,
    additionalIncome,
    creditScore,
    prequalify,
    termsCheckbox,
    scheduleCheckbox,
    imageData,
    redirectUri,
    date,
    time,
  } = req.body;

  const auth = {
    auth: {
      api_key: process.env.MAIL_GUN_API_KEY,
      domain: process.env.MAIL_GUN_DOMAIN,
    },
  };
  let transporter = nodemailer.createTransport(mailGun(auth));

  var mailOptions = {
    from: `${name} <${email}>`,
    to: process.env.EMAIL,
    subject: `Enquire from ${redirectUri}`,
    html: `
<div class="form-field">
  <strong>Name:</strong>
  <span>${name}</span>
</div>
<div class="form-field">
  <strong>Email:</strong>
  <span>${email}</span>
</div>
<div class="form-field">
  <strong>Telephone:</strong>
  <span>${telephone}</span>
</div>
<div class="form-field">
  <strong>Occupation:</strong>
  <span>${occupation}</span>
</div>
<div class="form-field">
  <strong>Years Employed:</strong>
  <span>${yearsEmployed}</span>
</div>
<div class="form-field">
  <strong>Annual Income:</strong>
  <span>${annualIncome}</span>
</div>
<div class="form-field">
  <strong>Additional Income:</strong>
  <span>${additionalIncome}</span>
</div>
<div class="form-field">
  <strong>Credit Score:</strong>
  <span>${creditScore}</span>
</div>
<div class="form-field">
  <strong>Prequalifies for an Auto Loan:</strong>
  <span>${prequalify}</span>
</div>
<div class="form-field">
  <strong>Test Drive Date:</strong>
  <span>${date}</span>
</div>
<div class="form-field">
  <strong>Test Drive Time:</strong>
  <span>${time}</span>
</div>
<div class="form-field">
  <strong>Test Drive Vehicle preferences:</strong>
</div>

<div class="preference-box">
  <a href="${imageData[0].data}">${imageData[0].data}</a>
</div>

<div class="preference-box">
  <a href="${imageData[1].data}">${imageData[1].data}</a>
</div>

<div class="preference-box">
  <a href="${imageData[2].data}">${imageData[2].data}</a>
</div>

<strong>${scheduleCheckbox
        ? "Does want to schedule a test drive"
        : "Does NOT want to schedule a test drive"
      }</strong>
<strong>${termsCheckbox
        ? "Does agree to terms and conditions"
        : "Does NOT agree to terms and conditions"
      }</strong>
    
<br>
<br>
<br>
<style style="display: none;" type="text/css">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    width: max-content;
    display: block;
  }

  .preference-box {
    padding: .5rem;
    border: 1px solid #ccc;
    border-radius: .25rem;
    margin-bottom: .25rem;
  }

  .form-field {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: .25rem;
  }
  .form-field strong {
    margin-right: .25rem;
  }
</style>
`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send({
        status: 400,
        message: "There was an error sending your message.",
        error,
      });
    } else {
      res.send({
        status: 200,
        message: "Message sent... Redirecting back now",
      });
    }
  });
});
