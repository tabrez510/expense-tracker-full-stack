const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../utils/database');

const getUserLeaderboard = async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name']
        });
        const expenses = await Expense.findAll({
            attributes: ['userId', [sequelize.fn('sum', sequelize.col('amount')), 'total_expense']],
            group: ['userId']
        });

        // const userAggregatedExpenses = {};

        // expenses.forEach((expense) => {
        //     if(userAggregatedExpenses[expense.userId]){
        //         userAggregatedExpenses[expense.userId] += expense.amount;
        //     } else {
        //         userAggregatedExpenses[expense.userId] = expense.amount;
        //     }
        // });
        console.log(expenses);

        // const userLeaderboardDetails = [];
        // users.forEach((user) => {
        //     userLeaderboardDetails.push({name: user.name, total_expense: expenses.total_expense || 0});
        // });

        // userLeaderboardDetails.sort((b, a) => a.total_expense - b.total_expense);
        // console.log(userLeaderboardDetails);
        res.json(expenses);
    } catch(err) {
        res.status(504).json({success: false, message: 'Internal Server Error'});
    }
}

module.exports = {
    getUserLeaderboard
}