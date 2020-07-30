"use strict";

const { maxUsers, actualMin, maxServices, maxBids } = require("../constants");
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bids = [...Array(maxBids)].map((bid) => ({
      amount: faker.commerce.price(),
      coverLetter: faker.lorem.paragraph(),
      canTravel: faker.random.boolean(),
      availability: faker.company.catchPhraseDescriptor(),
      currency: faker.address.state(), //
      userId: faker.random.number({ min: actualMin, max: maxUsers }), //* generates fake whole numbers in given range
      serviceId: faker.random.number({ min: actualMin, max: maxServices }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Bids", bids, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Bids", null, {});
  },
};
