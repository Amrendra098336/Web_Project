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
const { celebrate, Joi, Segments, errors } = require("celebrate");
const passport = require("./passport");
const users = require("../../models/user");
const Sales = require("./../../models/sales");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/get", async (req, res) => {
  try {
    const sales = await Sales.find({}).limit(10);
    res.send(sales);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * POST /api/sales
 *  This route uses the body of the request to add a new "sales" document to the collection and return the created object / fail message to the client.
 */
router.post("/api/sales", async (req, res) => {
  try {
    // Create a new Sales document from the request body
    itemsParsed = JSON.parse(req.body.items);
    const newSale = Sales({
      customer: {
        gender: req.body.gender,
        age: req.body.age,
        email: req.body.email,
        satisfaction: req.body.satisfaction,
      },
      saleDate: new Date(),
      items: itemsParsed,
      storeLocation: req.body.storeLocation,
      couponUsed: req.body.couponUsed,
      purchaseMethod: req.body.purchaseMethod,
    });

    // Save the new Sales document to the database
    const result = await Sales.create(newSale);

    // Return the created object to the client
    res.status(201).json(result);
  } catch (error) {
    // Return a fail message to the client if the operation fails

    res.status(500).json({ message: "Failed to create sale" + error });
  }
});

/**
 * GET /api/sales
 *  This route must accept the numeric query parameters "page" and "perPage" as well as the string parameter "storeLocation", ie:
    /api/sales?page=1&perPage=5&storeLocation=Seattle. It will use these values to return all "sales" objects for a specific "page" to the client as well as optionally filtering by " storeLocation", if provided.
 */
router.get("/api/sales", async (req, res) => {
  try {
    // Extract the query parameters
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const storeLocation = req.query.storeLocation;
    let result = await fetchSales(page, perPage, storeLocation);
    // Return the paginated results to the client
    res.status(200).json(result);
  } catch (error) {
    // Return a fail message to the client if the operation fails
    res.status(500).json({ message: "Failed to get sales" + error });
  }
});

/**
 *EXTRA CHALLENGE: add query param validation to your route in order to make sure that the params you expect are present, and of the type you expect. You can do this using packages like https://www.npmjs.com/package/celebrate or https://express-validator.github.io/docs/checkapi.html. If the params are incorrect, your route should return a 400 response (client error) vs. 500 (server error).
 */
router.get(
  "/api/sales/validation",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().required().messages({
        "any.required": "Page number is required",
        "number.base": "Page number must be a number",
      }),
      perPage: Joi.number().required().messages({
        "any.required": "Per Page  is required",
        "number.base": "Per Page  must be a number",
      }),
      storeLocation: Joi.string().optional(),
    }),
  }),
  async (req, res) => {
    try {
      // Extract the query parameters
      const page = parseInt(req.query.page);
      const perPage = parseInt(req.query.perPage);
      const storeLocation = req.query.storeLocation;

      let result = await fetchSales(page, perPage, storeLocation);

      // Return the paginated results to the client
      res.status(200).json(result);
    } catch (error) {
      // Return a fail message to the client if the operation fails
      res.status(500).json({ message: "Failed to get sales" + error });
    }
  }
);

/**
 * GET /api/sales
o This route must accept a route parameter that represents the _id of the desired sales object, ie: /api/sales/5bd761dcae323e45a93cd00b. It will use this parameter to return a specific "sales" object to the client.
 * 
 */

router.get(
  "/api/sales/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  async (req, res) => {
    try {
      const sales = await Sales.findById(req.params.id).lean().exec();

      if (!sales) {
        return res.status(404).json({ message: "Sales not found" });
      }

      res.status(200).json(sales);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get sales" });
    }
  }
);

/**
 *
 * PUT /api/sales
 *  This route must accept a route parameter that represents the _id of the desired sales object, ie: /api/sales/5eb3d668b31de5d588f4292e as well as read the contents of the request body. It will use these values to update a specific "sales" document in the collection and return a success / fail message to the client.
 *
 */

router.put("/api/sales/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sale = await Sales.findById(id);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    const {
      saleDate,
      storeLocation,
      items,
      gender,
      age,
      email,
      satisfaction,
      couponUsed,
      purchaseMethod,
    } = req.body;

    // Update saleDate if provided
    if (saleDate !== undefined) {
      sale.saleDate = saleDate;
    }
    // Update storeLocation if provided
    if (storeLocation !== undefined) {
      sale.storeLocation = storeLocation;
    }

    if (gender !== undefined) {
      sale.customer.gender = gender;
    }

    if (age !== undefined) {
      sale.customer.age = age;
    }

    if (email !== undefined) {
      sale.customer.email = email;
    }

    if (satisfaction !== undefined) {
      sale.customer.satisfaction = satisfaction;
    }

    if (purchaseMethod !== undefined) {
      sale.customer.purchaseMethod = purchaseMethod;
    }
    if (couponUsed !== undefined) {
      sale.customer.couponUsed = couponUsed;
    }

    // Update items if provided
    if (items !== undefined) {
      // Loop through each item and update as necessary
      items.forEach((item, index) => {
        // Find the matching item in the sale's items array by index
        const saleItem = sale.items[index];
        // Update name if provided
        if (item.name !== undefined) {
          saleItem.name = item.name;
        }
        // Update quantity if provided
        if (item.quantity !== undefined) {
          saleItem.quantity = item.quantity;
        }
        // Update price if provided
        if (item.price !== undefined) {
          saleItem.price = item.price;
        }
        // Update tags if provided
        if (item.tags !== undefined) {
          saleItem.tags = item.tags;
        }
      });
    }

    const updatedSale = await sale.save();

    res.json(updatedSale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /api/sales
 * This route must accept a route parameter that represents the _id of the desired sales object, ie: /api/sales/5eb3d668b31de5d588f4292e. It will use this value to delete a specific "sale" document from the collection and return a success / fail message to the client.
 */
router.delete(
  "/api/sales/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user.id;
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      try {
        const id = req.params.id;
        const sale = await Sales.findById(id);
        if (!sale) {
          return res.status(404).json({ error: "Sale not found" });
        }
        const result = await Sales.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
          return res.json({ message: "Sale deleted successfully" });
        } else {
          return res.status(500).json({ error: "Failed to delete sale" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }
);

async function fetchSales(page, perPage, storeLocation) {
  // Build the query based on the provided parameters
  let query = Sales.find({});
  if (storeLocation) {
    query = query.where("storeLocation").equals(storeLocation);
  }

  // Execute the query and paginate the results
  const totalSales = await Sales.countDocuments(query);
  const totalPages = Math.ceil(totalSales / perPage);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const sales = await query.skip(startIndex).limit(perPage).lean().exec();

  // Return an error response if there are no sales data available
  if (sales.length === 0) {
    throw new Error("No sales data available");
  }

  // Return the paginated results to the client
  return {
    page: currentPage,
    perPage: perPage,
    total: totalSales,
    totalPages: totalPages,
    data: sales,
  };
}

router.get("*", async (req, res) => {
  try {
    res.send("Please enter correct URL ");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.use(errors());
const salesAPI = {
  router: router,
  fetchSales: fetchSales,
};

module.exports = salesAPI;
