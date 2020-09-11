// Update with your config settings.

const defaultConfig = {
  client: "mysql",
  migrations: {
    directory: "./db/migrations",
    tableName: "knex_migrations",
  },
};

module.exports = {
  development: {
    ...defaultConfig,
    connection: {
      database: "Micropost",
      user: "root",
      password: "roottoor",
    },
  },

  review: {
    ...defaultConfig,
    connection: process.env.CLEARDB_DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
  },

  staging: {
    ...defaultConfig,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    ...defaultConfig,
    connection: {
      database: "Micropost",
      user: "root",
      password: "roottoor",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
