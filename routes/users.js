const express = require("express");
const { User } = require("../models/index");
const router = express.Router();

router.post("/", async (req, res) => {
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });
  res.send(user);
});

//Update a database entry
router.put("/:id", async (req, res) => {
  const user = await User.update(
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  res.send('okay');
});

module.exports = router;
