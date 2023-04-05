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
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../.././config/config");
const users = require("../../models/user");

router.get("/", async (req, res) => {
  try {
    res.send("Project login");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Check if the password is correct
  if (!bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: "1h",
  });
  res.json({ token });
});
module.exports = router;
