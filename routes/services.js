const express = require("express");
const { Service, Address } = require("../models/index");
const multer = require("multer");
//! statusId => not to be changed by the user

const router = express.Router();

//creates a new entry
router.post("/", async (req, res) => {
  const service = await Service.create({
    title: req.body.title,
    description: req.body.description,
    budgetMin: req.body.budgetMin,
    budgetMax: req.body.budgetMax,
    terms: req.body.terms,
    imageUrl: req.body.imageUrl,
    userId: req.body.userId,
    categoryId: req.body.categoryId,
    statusId: req.body.statusId
  });

  res.send(service);
});

//gets data on specific based on id
router.get("/:id", async (req, res) => {
  const service = await Service.findAll({
    where: {
      id: req.params.id,
    },
  });

  res.send(service);
});

//gets all entries from db
router.get("/", async (req, res) => {
  const services = await Service.findAll();

  res.send(services);
});

//TODO get all services for a particular user
router.get('/foruser/:userId', async(req, res) => {
  const services = await Service.findAll({
    where: {
      userId: req.params.userId
    },
  });

  res.send(services);

});

//TODO get all services from a certain category id
router.get("/fromcategory/:id", async (req, res) => {
  const services = await Service.findAll({
    where: {
      categoryId: req.params.id,
    },
  });

  res.status(200).send(services);
});

//TODO COMPOSITE: get a service with its address Test

router.get("/address/:id", async (req, res) => {
  const services = await Service.findAll({
    where: {
      categoryId: req.params.id,
    },
    include: Address
  });

  res.status(200).send(services);
});

//updates the data
router.put("/:id", (req, res) => {
  Service.update(
    {
      title: req.body.title,
      description: req.body.description,
      budgetMin: req.body.budgetMin,
      budgetMax: req.body.budgetMax,
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
      id: req.params.id,
    },
  }).then(res.send("Service has been deleted successfully"));
});

module.exports = router;
//TODO fetch only services that are active and have an address to put to the category -> services page
