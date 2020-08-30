const express = require("express");
const router = express.Router();
const { Service, Address } = require("../models/index");
const multer = require("multer");
var fs = require("fs");
const { urlOrIp, port} = require("../constants")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 },
});

//creates a new entry
router.post("/", upload.single("imageUrl"), async (req, res, next) => {
  const service = Service.create({
    title: req.body.title,
    description: req.body.description,
    budgetMin: parseFloat(req.body.budgetMin),
    budgetMax: parseFloat(req.body.budgetMax),
    terms: req.body.terms,
    // Append server's details statically to the url being saved
    imageUrl: `http://${urlOrIp}:${port}/` + req.file.path,
    userId: parseInt(req.body.userId),
    categoryId: parseInt(req.body.categoryId),
    statusId: parseInt(req.body.statusId),
  }).then((service) => {
    res.send(service);
  });
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
router.get("/foruser/:userId", async (req, res) => {
  const services = await Service.findAll({
    where: {
      userId: req.params.userId,
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
    include: Address,
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

//! statusId => not to be changed by the user
