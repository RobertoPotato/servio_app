const auth = require("../middleware/auth");
const express = require("express");
const { Bid, User, Service, Status } = require("../models/index");
const { createAlert, bidsReceived } = require("../notifications");
const router = express.Router();

const testCurrency = "KES"; //! Remove this
//creates a new entry
//? confirm that the user has not already posted a bid for the service
router.post("/", auth, async (req, res) => {
  const bid = await Bid.create({
    amount: req.body.amount,
    coverLetter: req.body.coverLetter,
    canTravel: req.body.canTravel,
    availability: req.body.availability,
    //TODO Uncomment => currency: req.body.currency,
    userId: req.user.userId, //user who made the bid
    serviceId: req.body.serviceId,
    currency: testCurrency,
  }).then(
    console.log("crafting alert"),
    createAlert(
      1,
      bidsReceived.title,
      bidsReceived.payLoad,
      1,
      bidsReceived.type
    )
  );

  res.status(201).send(bid);
});

//TODO get all bids for a certain service => Users can see bids made for a service theyve requested
router.get("/formyservice/:serviceId", auth, async (req, res) => {
  const bids = await Bid.findAll({
    where: {
      serviceId: req.params.serviceId,
    },
    include: [{ model: User, attributes: ["firstName", "lastName"] }],
  });

  console.log(bids);
  res.send(bids);
});

//TODO user can see all the bids they've made and the associated service
//gets data on specific based on id
router.get("/mine", auth, async (req, res) => {
  const bid = await Bid.findAll({
    where: {
      userId: req.user.userId,
    },
    attributes: {
      exclude: ["id", "userId", "serviceId", "createdAt"],
    },
    include: [
      {
        model: Service,
        include: [
          {
            model: Status,
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          },
        ],
        attributes: {
          exclude: ["id", "userId", "categoryId", "createdAt", "statusId"],
        },
      },
    ],
  });

  res.send(bid);
});

//updates the data
router.put("/:id", (req, res) => {
  Bid.update(
    {
      amount: req.body.amount,
      coverLetter: req.body.coverLetter,
      canTravel: req.body.canTravel,
      availability: req.body.availability,
      currency: req.body.currency,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(res.send("Bid updated"));
});

//delets a particular entry.
router.delete("/:id", (req, res) => {
  Bid.destroy({
    where: {
      id: req.params.id,
    },
  }).then(res.send("Successfully deleted"));
});

module.exports = router;
