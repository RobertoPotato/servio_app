const express = require("express");
const { User, Profile, Tier, Role } = require("../models/index");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
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
  })
);

//TODO find Logged in user's profile
router.get(
  "/mine",
  auth,
  asyncMiddleware(async (req, res) => {
    const profiles = await Profile.findOne({
      where: { userId: req.user.userId },
      attributes: {
        exclude: ["id", "userId", "tierId", "roleId", "createdAt"],
      },
      include: [
        { model: Tier, attributes: ["title", "description", "badgeUrl"] },
        { model: Role, attributes: ["title", "description"] },
      ],
    });

    res.send(profiles);
  })
);

//TODO find the profile of another user
router.get(
  "/:userid",
  auth,
  asyncMiddleware(async (req, res) => {
    const profiles = await Profile.findOne({
      where: { userId: req.params.userid },
      attributes: {
        exclude: ["id", "userId", "tierId", "roleId", "createdAt"],
      },
      include: [
        { model: Tier, attributes: ["title", "description", "badgeUrl"] },
        { model: Role, attributes: ["title", "description"] },
      ],
    });

    res.send(profiles);
  })
);

//Update a database entry
router.put(
  "/modify",
  auth,
  asyncMiddleware(async (req, res) => {
    await User.update(
      {
        bio: req.body.bio,
        picture: req.body.picture,
        avatar: req.body.avatar,
        phoneNumber: req.body.phoneNumber,
      },
      {
        where: {
          id: req.user.userId,
        },
      }
    );

    res.send("okay");
  })
);

module.exports = router;
