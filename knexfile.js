// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'Micropost',
      user:     'root',
      password: 'roottoor'
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      database: 'Micropost',
      user:     'root',
      password: 'roottoor'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      database: 'Micropost',
      user:     'root',
      password: 'roottoor'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    }
  }

};
