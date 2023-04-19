require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const hbs = require("hbs");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 9000;
const dburl = process.env.DBURL;
const userrouter = require("../router/userrouter");
const adminrouter = require("../router/adminrouter");
const publicpath = path.join(__dirname, "../public");
const viewpath = path.join(__dirname, "../templetes/view");
const partialpath = path.join(__dirname, "../templetes/partials");

app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(partialpath);
app.use(express.static(publicpath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.listen(port, () => {
  console.log("Server Running on port " + port);
});

mongoose
  .connect(dburl)
  .then(() => {
    console.log("E-shop-project-Two database connect");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/", userrouter);
app.use("/", adminrouter);
