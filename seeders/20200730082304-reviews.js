"use strict";

const { maxUsers, maxReviews, actualMin, maxJobs } = require("../constants");
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const reviews = [...Array(maxReviews)].map((review) => ({
      stars: faker.finance.amount(0, 5, 1), //* generates a 1 decimal place random from 0 - 5
      content: faker.lorem.paragraph(),
      subjectId: faker.random.number({ min: actualMin, max: maxUsers }), //* generates fake whole numbers in given range
      reviewerId: faker.random.number({ min: actualMin, max: maxUsers }),
      jobId: faker.random.number({ min: actualMin, max: maxJobs }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Reviews", reviews, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Reviews", null, {});
  },
};
