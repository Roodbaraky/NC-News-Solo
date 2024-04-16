const { config } = require('dotenv');
const { Pool } = require('pg');


const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

const config2 = {};

if (ENV === 'production') {
  config2.connectionString = process.env.DATABASE_URL;
  config2.max = 2;
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

console.log(config2)
module.exports = new Pool(config2);
