"use strict";

const {
  actualMin,
  maxUsers,
  maxCategories,
  maxStatuses,
  maxServices
} = require("../constants");
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const services = [...Array(maxServices)].map((service) => ({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      budget: faker.finance.amount(),
      terms: faker.company.catchPhraseDescriptor(),
      imageUrl: faker.image.imageUrl(),
      userId: faker.random.number({ min: actualMin, max: maxUsers }), //* generates fake whole numbers in given range
      categoryId: faker.random.number({ min: actualMin, max: maxCategories }), //
      statusId: faker.random.number({ min: actualMin, max: maxStatuses }),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Services", services, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Services", null, {});
  },
};
