const express = require("express");
const { Alert } = require("../models/index");

const router = express.Router();
//TODO All these methods should only be conducted by an admin user
//creates a new entry
router.post("/", async (req, res) => {
  const alert = await Alert.create({
    createdBy: req.body.userId,
    title: req.body.title,
    payload: req.body.payload,
    createdFor: req.body.clientOrAgentId,
    isSeen: false,
  });
  res.status(200).send("OK");
});

//gets alerts for a particular user
router.get("/foruser/:userid", async (req, res) => {
  const alert = await Alert.findAll({
    attributes: { exclude: ["updatedAt", "createdBy"] },
    where: {
      createdFor: req.params.userid,
    },
  });

  res.send(alert);
});

//updates the data
router.put("/:id/seen", (req, res) => {
  Alert.update(
    {
      isSeen: true,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(res.send("Alert updated"));
});

//! delets a particular entry. Deletions will be handled automatically by the system 24 hours after item is marked as seen
router.delete("/:id", (req, res) => {
  Alert.destroy({
    where: {
      id: req.params.id,
    },
  }).then(res.send("Alert has been deleted"));
});

module.exports = router;
