const express = require("express");
const { Review, User } = require("../models/index");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");

const router = express.Router();

//* creates a new entry
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const review = await Review.create({
      stars: req.body.stars,
      content: req.body.content,
      agentId: req.body.agentId,
      clientId: req.body.clientId,
    });

    res.send(review);
  })
);

//* gets data on specific based on id
router.get(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const review = await Review.findAll({
      where: {
        id: req.params.id,
      },
    });

    res.send(review);
  })
);

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const reviews = await Review.findAll({
      where: {
        agentId: req.user.userId,
      },
      attributes: ["stars", "content", "clientId", "createdAt"],
      include: { model: User, attributes: ["firstName", "lastName"] },
    });

    res.send(reviews);
  })
);

router.get(
  "/foruser/:userId",
  auth,
  asyncMiddleware(async (req, res) => {
    const reviews = await Review.findAll({
      where: {
        agentId: req.params.userId,
      },
      attributes: ["stars", "content", "clientId", "createdAt"],
      include: { model: User, attributes: ["firstName", "lastName"] },
    });

    res.send(reviews);
  })
);

//? Should users be able to edit their reviews?
//* updates the data
router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
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
  })
);

//TODO make it that reviews are only deleted by admins
//! delets a particular entry.
/*router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    Review.destroy({
      where: {
        id: req.params.id,
      },
    }).then(res.send("Review deleted successfully"));
  })
);
*/

module.exports = router;
