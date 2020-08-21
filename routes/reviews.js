const express = require("express");
const { Review, User } = require("../models/index");

// list of fillable fields
// stars
// content
// agentId
// clientId

const router = express.Router();

//* creates a new entry
router.post("/", async (req, res) => {
  const review = await Review.create({
    stars: req.body.stars,
    content: req.body.content,
    agentId: req.body.agentId,
    clientId: req.body.clientId,
  });

  res.send(review);
});

//* gets data on specific based on id
router.get("/:id", async (req, res) => {
  const review = await Review.findAll({
    where: {
      id: req.params.id,
    },
  });

  res.send(review);
});

router.get('/foruser/:userid', async(req, res) => {
  const reviews = await Review.findAll({
    where: {
      agentId: req.params.userid
    },
    attributes : ["stars", "content", "clientId", "createdAt"],
    include: {model: User, attributes: ["firstName", "lastName"]},
  });

  res.send(reviews);
});

//* gets all entries from db
router.get("/", async (req, res) => {
  const reviews = await Review.findAll();

  res.send(reviews);
});

//? Should users be able to edit their reviews?
//* updates the data
router.put("/:id", (req, res) => {
  Review.update(
    {
      stars: req.body.stars,
      content: req.body.content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(res.send("Review updated"));
});

//* delets a particular entry.
router.delete("/:id", (req, res) => {
  Review.destroy({
    where: {
      id: req.params.id,
    },
  }).then(res.send("Review deleted successfully"));
});

module.exports = router;
