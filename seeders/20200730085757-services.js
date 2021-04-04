'use strict';

const {
  actualMin,
  maxUsers,
  maxCategories,
  maxStatuses,
  maxServices,
} = require('../constants');

const { SERVICE_ACTIVE } = require('../statusCodes');

const faker = require('faker');

//all the services will be seeded with the active status
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const services = [...Array(maxServices)].map((service) => ({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      budgetMin: faker.finance.amount(),
      budgetMax: faker.finance.amount(),
      terms: faker.company.catchPhraseDescriptor(),
      imageUrl: faker.image.imageUrl(),
      county: faker.address.county(),
      town: faker.address.city(),
      userId: faker.random.number({ min: actualMin, max: maxUsers }), //* generates fake whole numbers in given range
      categoryId: faker.random.number({ min: actualMin, max: maxCategories }), //
      statusId: SERVICE_ACTIVE /*faker.random.number({ min: actualMin, max: maxStatuses })*/,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Services', services, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Services', null, {});
  },
};
