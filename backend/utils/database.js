const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '8574421120',
    database: process.env.DB_NAME || 'expense-tracker',
  });

module.exports = sequelize;