const express = require("express");
const { Category } = require("../models/index");

// fillable fields
// title
// description
// imageUrl
// themeColor

const router = express.Router();

//creates a new entry
router.post("/", async (req, res) => {
  const category = await Category.create({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    themeColor: req.body.themeColor,
  });

  res.send(category);
});

//gets data on specific based on id
router.get("/:id", async (req, res) => {
  const category = await Category.findAll({
    where: {
      id: req.params.id,
    },
  });

  res.send(category);
});

//gets all entries from db
router.get("/", async (req, res) => {
  const categories = await Category.findAll();
  res.send(categories);
});

//updates the data
router.put("/:id", (req, res) => {
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
});

//delets a particular entry.
router.delete("/:id", async (req, res) => {
  const category = await Category.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.send("OK");
});

module.exports = router;
