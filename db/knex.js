const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile.js')[environment];
const knex = require('knex')(config);
const setupPaginator = require('knex-paginator');
setupPaginator(knex);

module.exports = knex;