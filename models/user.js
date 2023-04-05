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
const bcrypt = require("bcrypt");
const users = [
  {
    id: 1,
    username: "user1",
    passwordHash: bcrypt.hashSync("password1", 10),
  },
  {
    id: 2,
    username: "user2",
    passwordHash: bcrypt.hashSync("password2", 10),
  },
];

module.exports = users;
