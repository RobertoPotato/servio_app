const asyncMiddleware = require('../middleware/asyncMiddleware');
const auth = require('../middleware/auth');
const express = require('express');
const { Bid, User, Service, Status } = require('../models/index');
const { createAlert, bidsReceived } = require('../notifications');
const router = express.Router();

const defaultCurrency = 'KES';
//creates a new entry
//? confirm that the user has not already posted a bid for the service
router.post(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    //Confirm the service exists If not end this request
    var service = await Service.findOne({
      where: {
        id: req.body.serviceId,
      },
    });

    if (service == null)
      return res.status(400).send({ error: 'The service no longer exists' });

    //If the service belongs to user making the bid, end request
    if (service.userId == req.user.userId)
      return res.status(400).send({ error: "Can't bid for your own service" });

    //If the user has already placed a bid, end request
    const bidExists = await Bid.findAll({
      where: {
        serviceId: req.body.serviceId,
        userId: req.user.userId,
      },
    });

    if (bidExists.length != 0)
      return res.status(400).send({ error: 'You already made a bid for this' });

    //Otherwise, create the bid
    const bid = await Bid.create({
      amount: req.body.amount,
      coverLetter: req.body.coverLetter,
      canTravel: req.body.canTravel,
      availability: req.body.availability,
      userId: req.user.userId,
      serviceId: req.body.serviceId,
      currency: defaultCurrency,
    });

    var alert = await createAlert(
      req.user.userId,
      bidsReceived.title + service.title,
      req.user.firstName +
        ' ' +
        req.user.lastName +
        bidsReceived.payLoad +
        ': ' +
        service.title,
      service.userId,
      bidsReceived.type
    );

    res.status(200).send({ bid });
  })
);

//get all bids for a certain service => Users can see bids made for a service theyve requested
router.get(
  '/formyservice/:serviceId',
  auth,
  asyncMiddleware(async (req, res) => {
    //check for service
    const service = await Service.findOne({
      where: {
        id: req.params.serviceId,
      },
    });

    //If service doesn't exist, end request
    if (service == null)
      return res.status(400).send({ error: 'Nothing to show' });

    //If service doesn't belong to the logged-in user, end request
    if (service.userId != req.user.userId) {
      return res
        .status(401)
        .send({ error: 'You have no permission to view this resource' });
    }

    const bids = await Bid.findAll({
      where: {
        serviceId: req.params.serviceId,
      },
      include: [{ model: User, attributes: ['firstName', 'lastName'] }],
    });

    res.status(200).send(bids);
  })
);

// user can see all the bids they've made and the associated service
router.get(
  '/mine',
  auth,
  asyncMiddleware(async (req, res) => {
    const bid = await Bid.findAll({
      where: {
        userId: req.user.userId,
      },
      attributes: {
        exclude: ['id', 'userId', 'serviceId', 'createdAt'],
      },
      include: [
        {
          model: Service,
          include: [
            {
              model: Status,
              attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
            },
          ],
          attributes: {
            exclude: ['id', 'userId', 'categoryId', 'createdAt', 'statusId'],
          },
        },
      ],
    });

    res.send(bid);
  })
);

//updates the data
router.put(
  '/update/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    await Bid.update(
      {
        amount: req.body.amount,
        coverLetter: req.body.coverLetter,
        canTravel: req.body.canTravel,
        availability: req.body.availability,
        currency: req.body.currency,
      },
      {
        where: {
          id: req.params.id,
          userId: req.user.userId,
        },
      }
    );
    res.send('Bid updated');
  })
);

//delets a particular entry.
router.delete(
  '/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    await Bid.destroy({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
    });
    res.send('Successfully deleted');
  })
);

//TODO Alert creation example
/**
 * then(
      console.log("crafting alert"),
      createAlert(
        1,
        bidsReceived.title,
        bidsReceived.payLoad,
        1,
        bidsReceived.type
      )
    );
 */

module.exports = router;
