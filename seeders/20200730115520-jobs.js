"use strict";

const { actualMin, maxUsers, maxBids, maxServices, maxStatuses, maxJobs } = require("../constants")
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const jobs = [...Array(maxJobs)].map((job) => ({
      clientId: faker.random.number({ min: actualMin, max: maxUsers }), //* generates fake whole numbers in given range
      agentId: faker.random.number({ min: actualMin, max: maxUsers }),
      bidId: faker.random.number({ min: actualMin, max: maxBids }), //* generates fake whole numbers in given range
      serviceId: faker.random.number({ min: actualMin, max: maxServices }),
      statusId: faker.random.number({ min: actualMin, max: maxStatuses }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Jobs", jobs, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Jobs", null, {});
  },
};
