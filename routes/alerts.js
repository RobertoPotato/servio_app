const express = require('express');
const { Alert } = require('../models/index');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const router = express.Router();

//TODO All these methods should only be conducted by an admin user
//creates a new entry
router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    await Alert.create({
      createdBy: req.body.userId,
      title: req.body.title,
      payload: req.body.payload,
      createdFor: req.body.clientOrAgentId,
      type: req.body.type,
      isSeen: false,
    });
    res.status(200);
  })
);

//gets alerts for a particular user
router.get(
  '/mine',
  auth,
  asyncMiddleware(async (req, res) => {
    const alerts = await Alert.findAll({
      attributes: { exclude: ['updatedAt', 'createdBy'] },
      where: {
        createdFor: req.user.userId,
      },

      //Order in a way that new alerts appear first
      order: [
        ['isSeen', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });

    if (alerts.length > 0) {
      res.status(200).send(alerts);
    } else {
      res.send('Nothing found');
    }
  })
);

//updates the data
router.put(
  '/seen',
  auth,
  asyncMiddleware(async (req, res) => {
    Alert.update(
      {
        isSeen: true,
      },
      {
        where: {
          id: req.body.id,
          //Ensures you only change an alert that's yours
          createdFor: req.user.userId,
        },
      }
    );

    res.status(200).send('Alert updated');
  })
);

//TODO delets a particular entry.
//! Deletions will be handled automatically by the system 24 hours after item is marked as seen
router.delete('/', async (req, res) => {
  //if the user has an admin's jwt
  //fetch the alerts
  alerts = await Alert.findAll({
    where: {
      isSeen: true,
    },
  });

  if (!alerts.length > 0) return res.status(200).send('No alerts to delete');

  Alert.destroy({
    where: {
      isSeen: true,
    },
  }).then(res.send(`${alerts.length} Alerts have been deleted`));
});

module.exports = router;
