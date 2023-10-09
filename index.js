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

app.use("/register", registerRouter);

app.use("/", auth.authenticateUser);

// app.listen(process.env.PORT);
app.listen(process.env.PORT,()=>{
    console.log("Server is running on port",process.env.PORT)
});

