const express = require("express");
const { Category, Service, Sequelize } = require("../models/index");
const asyncMiddleware = require("../middleware/asyncMiddleware");

const router = express.Router();

//gets data on specific based on id
router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const category = await Category.findAll({
      where: {
        id: req.params.id,
      },
    });

    res.send(category);
  })
);

//gets all entries from db
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const categories = await Category.findAll({
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Services.id")), "serviceCount"],
        ],
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Service,
          attributes: [],
        },
      ],
      group: ["Category.id"],
    });

    res.send(categories);
  })
);

//TODO updates the data
//! ONLY done by ADMIN
/*router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const category = {
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      themeColor: req.body.themeColor,
    };
    Category.update(
      {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        themeColor: req.body.themeColor,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then(() => {
      res.send(category);
    });
  })
);
*/

//TODO creates a new entry
//! ONLY done by ADMIN
/*router.post("/", async (req, res) => {
  const category = await Category.create({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    themeColor: req.body.themeColor,
  });

  res.send(category);
});
*/

//TODO delets a particular entry.
//! ONLY done by ADMIN
/*router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const category = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.send("OK");
  })
);
*/
module.exports = router;
