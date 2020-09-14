const express = require("express");
const { User } = require("../models/index");
const router = express.Router();

//!Creating the users in the auth routes

//Update a database entry
router.put("/me", async (req, res) => {
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

  res.send("okay");
});

module.exports = router;
