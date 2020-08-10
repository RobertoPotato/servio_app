const express = require("express");
const { User, Profile, Tier, Role } = require("../models/index");
const router = express.Router();

router.post("/", async (req, res) => {
  const profile = await Profile.create({
    bio: req.body.bio,
    picture: req.body.picture,
    avatar: req.body.avatar,
    phoneNumber: req.body.phoneNumber,
    userId: req.body.userId,
    tierId: req.body.tierId,
    addressId: req.body.addressId,
    roleId: req.body.roleId,
  });
  res.send(profile);
});

//TODO find the profile of a given user
router.get("/:userid", async (req, res) => {
  const profiles = await Profile.findOne({
    where: { userId: req.params.userid },
    attributes: {
      exclude: ['id', 'userId', 'tierId', 'roleId', 'createdAt']
    },
    include: [
      { model: Tier, attributes: ["title", "description", "badgeUrl"] },
      { model: Role, attributes: ["title", "description"] },
    ],
  });

  res.send(profiles);
});

//Update a database entry
router.put("/:id", async (req, res) => {
  //use the logged n user's id to find a profile whose
  //userId column value matches this
  //change the data in that profile as instructed
  //return the new profile data
  const user = await User.update(
    {
      bio: req.body.bio,
      picture: req.body.picture,
      avatar: req.body.avatar,
      phoneNumber: req.body.phoneNumber,
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
