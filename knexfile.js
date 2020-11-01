// Update with your config settings.

const defaultConfig = {
  client: "mysql",
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: "./db/migrations",
    tableName: "knex_migrations",
  },
};

module.exports = {
  development: {
    ...defaultConfig,
    seeds: {
      directory: "./db/seeds",
    },
  },

  review: {
    ...defaultConfig,
    connection: process.env.CLEARDB_DATABASE_URL,
  },

  staging: {
    ...defaultConfig,
  },

  production: {
    ...defaultConfig,
  },
};
