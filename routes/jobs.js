const express = require("express");
const { Job } = require("../models/index");

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

module.exports = router;
