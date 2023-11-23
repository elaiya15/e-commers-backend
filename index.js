// const mongo = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");  
  
  const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
const registerRouter = require("./router/registerRouter");
const auth = require("./modules/authModule");
const mongo = require("./connect");
dotenv.config();
mongo.connect();
const app = express();
// to parse req.body, to send the req.body from client to server
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
 res.send({server:" runing good"});
  
});
// app.use("/log", registerRouter);

app.post('/reg',async (req, res) => {

  try {
    const validation = joi.object({
      email: joi.string().email().trim(true).required(),
      password: joi.string().min(4).trim(true).required(),
      // confirmpassword: joi.string().min(4).trim(true).required(),
    });

    const { error } = validation.validate(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }

    // Email Id Validation
    const existUser = await mongo.selectedDb
      .collection("users")
      .findOne({ email: req.body.email });
    if (existUser) {
      return res.status(400).send({ msg: "You are already a registed user" });
    }
    // Password Hash
    const randomString = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, randomString);

    // Save in DB
    const insertedResponse = await mongo.selectedDb
      .collection("users")
      .insertOne({ ...req.body });
    res.send(insertedResponse);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
  
});



app.post('/login',async (req, res) => {
  const existUser = await mongo.selectedDb
  .collection("users")
  .findOne({ email: req.body.email });
if (!existUser) {
  return res.status(400).send({
    msg: "You are not a registered User. Pls signup to register yourself",
  });
}

// Password : Incorrect Password
const isSamePassword = await bcrypt.compare(
  req.body.password,
  existUser.password
);
if (!isSamePassword)
  return res.status(400).send({
    msg: "Incorrect Password",
  });

// Generate and send token as a response
const token = jwt.sign(existUser, process.env.SECRET_KEY, {
  expiresIn: "1hr",
});
res.send(token);
  
});

// app.listen(process.env.PORT);
app.listen(process.env.PORT||5000,()=>{
    console.log("Server is running on port",process.env.PORT)
});

