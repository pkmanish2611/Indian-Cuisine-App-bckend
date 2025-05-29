const knex = require('knex');

const db = knex({
  client: 'pg', // or 'mysql', 'sqlite3', etc.
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
});

module.exports = db;

// npm install pg knex  # for PostgreSQL