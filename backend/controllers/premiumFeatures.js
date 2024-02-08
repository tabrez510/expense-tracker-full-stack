const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../utils/database');

const getUserLeaderboard = async(req, res) => {
    try {
        const getUserLeaderboard = await User.findAll({
            attributes: ['name', 'total_expense'],
            order: [['total_expense', 'DESC']]
        });
        console.log(getUserLeaderboard);
        res.json([...getUserLeaderboard.map((user) => user.dataValues)]);
    } catch(err) {
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}

module.exports = {
    getUserLeaderboard
}








// previous code


// const users = await User.findAll({
    // attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_expense']],
    // include: [
    //     {
    //         model: Expense,
    //         attributes: []
    //     }
    // ],
    // group: ['User.id'],
//     order: [['total_expense', 'DESC']]
// });
// const userAggregatedExpenses = await Expense.findAll({
//     attributes: ['userId', [sequelize.fn('sum', sequelize.col('expense.amount')), 'total_expense']],
//     group: ['userId']
// });

// const userAggregatedExpenses = {};

// expenses.forEach((expense) => {
//     if(userAggregatedExpenses[expense.userId]){
//         userAggregatedExpenses[expense.userId] += expense.amount;
//     } else {
//         userAggregatedExpenses[expense.userId] = expense.amount;
//     }
// });

// const userLeaderboardDetails = [];
// users.forEach((user) => {
//     userLeaderboardDetails.push({name: user.name, total_expense: expenses.total_expense || 0});
// });

// userLeaderboardDetails.sort((b, a) => a.total_expense - b.total_expense);
// console.log(userLeaderboardDetails);