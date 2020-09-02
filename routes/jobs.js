const express = require("express");
const { Job, User, Service, Status, Bid } = require("../models/index");

// list of fillable fields
// clientId
// agentId
// bidId
// serviceId
// statusId

const router = express.Router();

//creates a new entry
router.post("/", async (req, res) => {
  const job = await Job.create({
    clientId: req.body.clientId,
    agentId: req.body.agentId,
    bidId: req.body.bidId,
    serviceId: req.body.serviceId,
    statusId: req.body.statusId,
  });

  res.send(job);
});

//gets data on specific based on id
router.get("/:id", async (req, res) => {
  const job = await Job.findAll({
    where: {
      id: req.params.id,
    },
  });

  res.send(job);
});

//TODO Get all jobs for a particular user, either services whose
//TODO bids were awarded or services they posted
//gets all entries from db
//?do we really want to get a list of all jobs?
router.get("/", (req, res) => {
  res.send("Invalid operation: Cannot get list of all jobs");
});

//! the only thing that will change is the status
//! operation to only be performed by admin
//* updates the data
router.put("/:id", (req, res) => {
  Job.update(
    {
      statusId: req.body.statusId,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(res.send("Job updated"));
});

//delets a particular entry.
router.delete("/:id", (req, res) => {
  res.send("Invalid operation: Cannot delete a job");
});

//* load jobs of a particular client
router.get("/forclient/:clientid", async (req, res) => {
  const tasks = await Job.findAll({
    attributes: ["createdAt", "clientId", "agentId"],
    include: [
      { model: User, as: "client", attributes: ["firstName", "lastName"] },
      { model: User, as: "agent", attributes: ["firstName", "lastName"] },
      {
        model: Bid,
        attributes: { exclude: ["id", "userId", "serviceId", "updatedAt"] },
      },
      {
        model: Service,
        attributes: {
          exclude: ["id", "userId", "categoryId", "statusId", "updatedAt"],
        },
      },
      {
        model: Status,
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      },
    ],
    where: {
      clientId: req.params.clientid,
    },
  });

  res.send(tasks);
});

//* load jobs of a particular agent
router.get("/foragent/:agentid", async (req, res) => {
  const tasks = await Job.findAll({
    attributes: ["createdAt", "clientId", "agentId"],
    include: [
      { model: User, as: "client", attributes: ["firstName", "lastName"] },
      { model: User, as: "agent", attributes: ["firstName", "lastName"] },
      {
        model: Bid,
        attributes: { exclude: ["id", "userId", "serviceId", "updatedAt"] },
      },
      {
        model: Service,
        attributes: {
          exclude: ["id", "userId", "categoryId", "statusId", "updatedAt"],
        },
      },
      {
        model: Status,
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      },
    ],
    where: {
      agentId: req.params.agentid,
    },
  });

  res.send(tasks);
});
module.exports = router;
