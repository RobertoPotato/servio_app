const express = require("express");
const { Bid } = require("../models/index");

// list of fillable fields
// amount
// coverLetter
// canTravel
// availability
// currency
// userId
// serviceId

const router = express.Router();

//creates a new entry
//? confirm that the user has not already posted a bid for the service
router.post("/", async (req, res) => {
  const bid = await Bid.create({
    amount: req.body.amount,
    coverLetter: req.body.coverLetter,
    canTravel: req.body.canTravel,
    availability: req.body.availability,
    currency: req.body.currency,
    userId: req.body.userId,
    serviceId: req.body.serviceId,
  });

  res.send(bid);
});

//TODO get all bids for a certain service
//TODO user can see all the bids they've made and the associated service
//gets data on specific based on id
router.get("/:id", async (req, res) => {
  const bid = await Bid.findAll({
    where: {
      id: req.params.id,
    },
  });

  res.send(bid);
});

//* Dont need to show all bids
//gets all entries from db
//router.get("/", (req, res) => {});

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
