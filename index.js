/****************************************************************************** ***
* ITE5315 – Project
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students. 
*
* Group member Name: Amrendra Kumar Singh
                     Nishant Kumar
                     Frank Sandhu
*Student IDs: N01499580
              N01511158
              N01501035 
Date: April 5th 2023
********************************************************************************/

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
var path = require("path");
const port = process.env.PORT || 8880;
const connectionString = process.env.WEB_DB_CONNECTION;
const salesAPI = require("./routes/api/profile");
const login = require("./routes/api/login");
const passport = require("./routes/api/passport");
require("dotenv").config();
const app = express();
app.use(passport.initialize());

const handlebars = require("handlebars");

handlebars.registerHelper("@index", function (index) {
  return index + 1;
});

// middleware for bodyparser
app.use(bodyParser.urlencoded({ extended: false }));

// get settings

/**
 * Adding middleware to serve static files.
 */
app.use(express.static(path.join(__dirname, "public")));
// setup handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", ".hbs");

// mongo db url
const db = connectionString;

// attempt to connect with DB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.log(err));

app.get("/", async (req, res) => {
  res.redirect("/form");
});

app.get("/form", function (req, res) {
  res.render("insertForm", {
    title: "Express",
  });
});

app.get("/formResult", async function (req, res) {
  const page = parseInt(req.query.page);
  const perPage = parseInt(req.query.perPage);
  const storeLocation = req.query.storeLocation;
  let error = "";
  if (isNaN(page) || isNaN(perPage) || page <= 0 || perPage <= 0) {
    error = "Please Enter value for Page Number and Data in Per Page ";
    res.render("error", {
      message: error,
    });
  } else {
    let Salesdata = await salesAPI.fetchSales(page, perPage, storeLocation);
    res.render("result", {
      resultData: Salesdata,
    });
  }
});

//const profile = require("./routes/api/profile");
app.use("/router", salesAPI.router);
app.use("/auth", login);
app.listen(port, () => console.log(`App running at port : ${port}`));
