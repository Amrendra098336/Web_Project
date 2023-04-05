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

const mongoose = require("mongoose");
// Define the schema
const saleSchema = new mongoose.Schema({
  saleDate: { type: Date },
  items: [
    {
      name: String,
      tags: [String],
      price: Number,
      quantity: Number,
    },
  ],
  storeLocation: { type: String },
  customer: {
    gender: { type: String },
    age: { type: Number },
    email: { type: String },
    satisfaction: { type: Number },
  },
  couponUsed: { type: Boolean },
  purchaseMethod: { type: String },
});

// Define the model
const Sale = mongoose.model("sales", saleSchema);

module.exports = Sale;
