const express = require("express");
const { User, Profile, Tier, Role } = require("../models/index");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const multer = require("multer");
var fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1920 * 1080 * 2 },
});

//creates a new entry
router.post(
  "/",
  upload.single("picture"),
  auth,
  asyncMiddleware(async (req, res, next) => {
    console.log(req.file);
    const profile = await Profile.create({
      bio: req.body.bio,
      phoneNumber: req.body.phoneNumber,
      userId: parseInt(req.user.userId),
      isVerified: false,
      tierId: 1,
      // Append server's details statically to the url being saved
      picture: req.file.path,
      addressId: 1,
      roleId: 1,
    });

    res.status(200).send(profile);
  })
);

//find Logged in user's profile
router.get(
  "/",
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

//confirm profile exists
router.get(
  "/validate",
  auth,
  asyncMiddleware(async (req, res) => {
    const profiles = await Profile.findOne({
      where: { userId: req.user.userId },
    });

    res.status(200);
  })
);

// find the profile of another user
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
