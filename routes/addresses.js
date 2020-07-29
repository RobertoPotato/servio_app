const express = require("express");
const { Address } = require("../models/index");

// list of fillable fields
// county
// town
// lat
// long

const router = express.Router();

//creates a new entry
router.post("/", async (req, res) => {
  const address = await Address.create({
    county: req.body.county,
    town: req.body.town,
    lat: req.body.lat,
    long: req.body.long,
  });

  res.send(address);
});

//gets data on specific based on id
router.get("/:id", async (req, res) => {
  const address = await Address.findAll({
    where: {
      id: req.params.id,
    },
  });

  res.send(address);
});

//we never want to get all the addresses from the db
// router.get("/", async(req, res) => {

// });

//updates the data
router.put("/:id", (req, res) => {
  const address = {
    county: req.body.county,
    town: req.body.town,
    lat: req.body.lat,
    long: req.body.long,
  };
  Address.update(
    {
      county: req.body.county,
      town: req.body.town,
      lat: req.body.lat,
      long: req.body.long,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(() => {
    res.send(address);
  });
});

//delets a particular entry requires admin access.
router.delete("/:id", (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  }).then(res.send("OK"));
});

module.exports = router;
