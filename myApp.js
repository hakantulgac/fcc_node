let express = require('express');
let app = express();
require("dotenv").config();

const msgStyle = process.env.MESSAGE_STYLE || "";

app.use("/public", express.static(__dirname+"/public"));

app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/views/index.html");
});

app.get("/json", (req, res)=>{
    let _msg = "Hello json";
    let msg = msgStyle !== "" ? _msg.toUpperCase() : _msg
    res.json({"message": msg});
});
































 module.exports = app;
