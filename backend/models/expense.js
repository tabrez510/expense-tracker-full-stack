const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Expense = sequelize.define('expense', {
    id: {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    discription: {
        type: Sequelize.STRING,
        allowNull: false
    },
    catagory: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Expense;