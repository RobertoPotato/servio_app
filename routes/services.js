const express = require("express");
const router = express.Router();
const { SERVICE_ACTIVE } = require("../statusCodes");
const { Service, User } = require("../models/index");
const multer = require("multer");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");

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

//creates a new service
router.post(
  "/",
  upload.single("imageUrl"),
  auth,
  asyncMiddleware(async (req, res, next) => {
    const service = await Service.create({
      title: req.body.title,
      description: req.body.description,
      budgetMin: parseFloat(req.body.budgetMin),
      budgetMax: parseFloat(req.body.budgetMax),
      terms: req.body.terms,
      imageUrl: req.file.path,
      userId: req.user.userId, //getting this value from the auth middleware
      categoryId: parseInt(req.body.categoryId),
      statusId: SERVICE_ACTIVE,
      county: req.body.county,
      town: req.body.town,
    });

    res.status(200).send(service);
  })
);

//gets data on specific service based on id
router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const service = await Service.findAll({
      where: {
        id: req.params.id,
      },
    });

    res.send(service);
  })
);

// get all services for a particular user
router.get(
  "/foruser/:abcde",
  auth,
  asyncMiddleware(async (req, res) => {
    const services = await Service.findAll({
      where: {
        userId: req.user.userId,
      },
    });

    res.send(services);
  })
);

// get all services from a certain category id
router.get(
  "/category/:id",
  asyncMiddleware(async (req, res) => {
    const services = await Service.findAll({
      where: {
        categoryId: req.params.id,
        statusId: SERVICE_ACTIVE,
      },
      include: { model: User, attributes: ["firstName", "lastName"] },
    });

    res.status(200).send(services);
  })
);

//updates the data
router.put(
  "/:serviceId",
  auth,
  asyncMiddleware(async (req, res) => {
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
        categoryId: req.body.categoryId,
      },
      {
        where: {
          id: req.params.serviceId,
          userId: req.user.userId,
        },
      }
    ).then(res.send("Service updated"));
  })
);

//delets a particular entry.
//TODO Delete only when there are no actively running jobs or bids for the service
router.delete(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    Service.destroy({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    }).then(res.send("Service has been deleted successfully"));
  })
);

module.exports = router;
