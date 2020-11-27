const express = require('express');
const { Job, User, Service, Status, Bid } = require('../models/index');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const {
  jobDone,
  jobComplete,
  bidAccepted,
  createAlert,
} = require('./../notifications');
const {
  JOB_COMPLETED,
  JOB_DONE,
  JOB_ACTIVE,
  SERVICE_ACTIVE,
  SERVICE_ASSIGNED,
} = require('../statusCodes');

const router = express.Router();

//creates a new entry
router.post(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    var service = await Service.findOne({
      where: {
        id: req.body.serviceId,
        statusId: SERVICE_ACTIVE,
      },
    });

    //end request if service can no longer be assigned to someone new
    if (service == null)
      return res.status(400).send({
        error:
          'This service is not taking any new bids. It might be unavailable or assigned to someone else already.',
      });

    //end request if service doesnt belong to logged in user
    if (service.userId != req.user.userId)
      return res.status(400).send({
        error:
          'No permission. Please log in again and if the problem persists contact support.',
      });

    const job = await Job.create({
      clientId: req.user.userId,
      agentId: req.body.agentId,
      bidId: req.body.bidId,
      serviceId: req.body.serviceId,
      statusId: JOB_ACTIVE,
    });

    //* Generating an alert
    createAlert(
      req.user.userId,
      bidAccepted.title,
      req.user.firstName +
        ' ' +
        req.user.lastName +
        bidAccepted.payLoad +
        service.title,
      req.body.agentId,
      bidAccepted.type
    );

    //TODO change the status of the service to assigned
    try {
      Service.update(
        {
          statusId: parseInt(SERVICE_ASSIGNED),
        },
        {
          where: {
            id: req.params.serviceId,
            userId: req.user.userId,
          },
        }
      );
    } catch (error) {}
    res.status(200).send(job);
  })
);

//updates the data. Marks job as done = done by agent
router.put(
  '/:jobid/done',
  auth,
  asyncMiddleware(async (req, res) => {
    const job = await Job.findOne({
      where: {
        id: req.params.jobid,
        agentId: req.user.userId,
      },
    });

    //end request if the job being changed doesn't exist
    if (job == null)
      return res.status(400).send({ error: 'The resource is not available' });

    //end request if job is already marked complete
    if (job.statusId == JOB_COMPLETED)
      return res.status(400).send({
        error: 'The job has already been marked complete by the client',
      });

    //end request if status has already been marked done
    if (job.statusId == JOB_DONE)
      return res
        .status(400)
        .send({ error: 'You already marked this job done' });

    const updated = await Job.update(
      {
        statusId: JOB_DONE,
      },
      {
        where: {
          id: req.params.jobid,
          agentId: req.user.userId,
        },
      }
    );

    createAlert(
      req.user.userId,
      jobDone.title,
      'Your agent, ' +
        req.user.firstName +
        ' ' +
        req.user.lastName +
        jobDone.payLoad,
      job.clientId,
      jobDone.type
    );

    res.status(200).send('Job done');
  })
);

//? Marks job as complete = carried out by client
router.put(
  '/:jobid/complete',
  auth,
  asyncMiddleware(async (req, res) => {
    const job = await Job.findOne({
      where: {
        id: req.params.jobid,
        clientId: req.user.userId,
      },
    });

    //end request if the job being changed doesn't exist
    if (job == null)
      return res.status(400).send({ error: 'The resource is not available' });

    //end request if status has already been changed as needed
    if (job.statusId == JOB_COMPLETED)
      return res
        .status(400)
        .send({ error: 'You already marked this job completed' });

    //Otherwise, update as needed
    const updated = await Job.update(
      {
        statusId: JOB_COMPLETED,
      },
      {
        where: {
          id: req.params.jobid,
          clientId: req.user.userId,
        },
      }
    );

    createAlert(
      req.user.userId,
      jobComplete.title,
      'Your client, ' +
        req.user.firstName +
        ' ' +
        req.user.lastName +
        jobComplete.payLoad,
      job.agentId,
      jobComplete.type
    );

    res.status(200).send('Job completed');
  })
);

//gets data on specific based on id
//TODO Make it so that either client or agent can get this info
router.get(
  '/:id',
  auth,
  asyncMiddleware(async (req, res) => {
    const job = await Job.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (job.clientId != req.user.userId || job.agentId != req.user.userId)
      return res
        .status(400)
        .send({ error: 'You lack permissions to view this resource' });

    res.status(200).send(job);
  })
);

//* load jobs of a particular client
router.get(
  '/forclient/:smtn',
  auth,
  asyncMiddleware(async (req, res) => {
    const tasks = await Job.findAll({
      attributes: ['id', 'createdAt', 'clientId', 'agentId'],
      include: [
        { model: User, as: 'client', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'agent', attributes: ['firstName', 'lastName'] },
        {
          model: Bid,
          attributes: { exclude: ['id', 'userId', 'serviceId', 'updatedAt'] },
        },
        {
          model: Service,
          attributes: {
            exclude: ['id', 'userId', 'categoryId', 'statusId', 'updatedAt'],
          },
        },
        {
          model: Status,
          attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
        },
      ],
      where: {
        clientId: req.user.userId,
      },
    });

    res.send(tasks);
  })
);

//* load jobs of a particular agent
//! Ignore the smtn item in the url
router.get(
  '/foragent/:smtn',
  auth,
  asyncMiddleware(async (req, res) => {
    const tasks = await Job.findAll({
      where: { agentId: req.user.userId },
      attributes: ['id', 'createdAt', 'clientId', 'agentId'],
      include: [
        { model: User, as: 'client', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'agent', attributes: ['firstName', 'lastName'] },
        {
          model: Bid,
          attributes: { exclude: ['id', 'userId', 'serviceId', 'updatedAt'] },
        },
        {
          model: Service,
          attributes: {
            exclude: ['id', 'userId', 'categoryId', 'statusId', 'updatedAt'],
          },
        },
        {
          model: Status,
          attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
        },
      ],
    });

    res.send(tasks);
  })
);

module.exports = router;
