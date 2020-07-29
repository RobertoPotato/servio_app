const express = require("express");
const { Role } = require("../models/index");

// list of fillable fields
// title
// description
const router = express.Router();

//creates a new entry
router.post("/", async (req, res) => {
  const role = await Role.create({
    title: req.body.title,
    description: req.body.description,
  });
  res.send(role);
});

//gets data on specific based on id
router.get("/:id", async (req, res) => {
  const role = await Role.findAll({
    where: {
      id: req.params.id,
    },
  });

  res.send(role);
});

//gets all entries from db
router.get("/", async (req, res) => {
  const roles = await Role.findAll();

  res.send(roles);
});

//updates the data
router.put("/:id", (req, res) => {
  Role.update(
    {
      title: req.body.title,
      description: req.body.description,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(res.send("Role updated"));
});

//delets a particular entry.
router.delete("/:id", (req, res) => {
  Role.destroy({
    where: {
      id: req.params.id,
    },
  }).then(res.send("Role has been deleted"));
});

module.exports = router;
