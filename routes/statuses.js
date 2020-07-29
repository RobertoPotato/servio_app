const express = require("express");
const { Status } = require("../models/index");

// list of fillable fields
// title
// description

//TODO All these methods should only be conducted by an admin user
const router = express.Router();

//creates a new entry
router.post("/", async (req, res) => {
  const status = await Status.create({
    title: req.body.title,
    description: req.body.description,
  });
  res.send(status);
});

//gets data on specific based on id
router.get("/:id", async (req, res) => {
  const status = await Status.findAll({
    where: {
      id: req.params.id,
    },
  });

  res.send(status);
});

//gets all entries from db
router.get("/", async (req, res) => {
  const statuses = await Status.findAll();

  res.send(statuses);
});

//updates the data
router.put("/:id", (req, res) => {
  Status.update(
    {
      title: req.body.title,
      description: req.body.description,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(res.send("status updated"));
});

//delets a particular entry.
router.delete("/:id", (req, res) => {
  Status.destroy({
    where: {
      id: req.params.id,
    },
  }).then(res.send("status has been deleted"));
});

module.exports = router;
