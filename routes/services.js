const express = require("express");
const { Service } = require("../models/index");

// list of fillable fields
// title
// description
// budget
// terms
// county
// town
// lat
// long
// userId
// categoryId
//! statusId => not to be changed by the user

const router = express.Router();

//creates a new entry
router.post("/", async (req, res) => {
  const service = await Service.create({
    title: req.body.title,
    description: req.body.description,
    budget: req.body.budget,
    terms: req.body.terms,
    county: req.body.county,
    town: req.body.town,
    lat: req.body.lat,
    long: req.body.long,
    userId: req.body.userId,
    categoryId: req.body.categoryId,
  });

  res.send(service);
});

//gets data on specific based on id
router.get("/:id", async(req, res) => {
    const service = await Service.findAll({
        where: {
            id: req.params.id
        }
    });

    res.send(service);
});

//gets all entries from db
router.get("/", async(req, res) => {
    const services = await Service.findAll();

    res.send(services);
});

//updates the data
router.put("/:id", (req, res) => {
    Service.update(
        {
          title: req.body.title,
          description: req.body.description,
          budget: req.body.budget,
          terms: req.body.terms,
          county: req.body.county,
          town: req.body.town,
          lat: req.body.lat,
          long: req.body.long,
          userId: req.body.userId,
          categoryId: req.body.categoryId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      ).then(res.send("Service updated"));
});

//delets a particular entry.
router.delete("/:id", (req, res) => {
    Service.destroy({
        where: {
            id: req.params.id
        }
    }).then(res.send("Service has been deleted successfully"));
});

module.exports = router;
