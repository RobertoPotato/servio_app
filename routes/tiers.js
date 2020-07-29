const express = require("express");
const { Tier } = require("../models/index");
const router = express.Router();

//TODO All these methods should only be conducted by an admin user
// list of fillable fields
// title
// description
// badgeUrl

//creates a new entry
router.post("/", async (req, res) => {
  const tier = await Tier.create({
    title: req.body.title,
    description: req.body.description,
    badgeUrl: req.body.badgeUrl,
  });
  res.send(tier);
});

//gets data on specific based on id
router.get("/:id", async (req, res) => {
  const tier = await Tier.findAll({
    where: {
      id: req.params.id,
    },
  });

  res.send(tier);
});

//gets all entries from db
router.get("/", async (req, res) => {
  const tiers = await Tier.findAll();

  res.send(tiers);
});

//updates the data
router.put("/:id", (req, res) => {
  Tier.update(
    {
      title: req.body.title,
      description: req.body.description,
      badgeUrl: req.body.badgeUrl,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(res.send("Tier updated"));
});

//delets a particular entry.
router.delete("/:id", (req, res) => {
  Tier.destroy({
    where: {
      id: req.params.id,
    },
  }).then(res.send("Tier has been deleted"));
});

module.exports = router;
