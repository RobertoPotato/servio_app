"use strict";

const faker = require("faker");
const { maxAddress, actualMin, maxServices } = require("../constants");
module.exports = {
  up: async (queryInterface, Sequelize) => {

    const addresses = [...Array(maxAddress)].map((address) => ({
      county: faker.address.state(),
      town: faker.address.county(),
      lat: faker.address.latitude(),
      long: faker.address.longitude(),
      serviceId: faker.random.number({ min: actualMin, max: maxServices }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return queryInterface.bulkInsert("Addresses", addresses);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Addresses", null, {});
  },
};
