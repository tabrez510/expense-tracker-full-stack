const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../utils/database');

exports.createExpense = async (req, res) => {
    const t = await sequelize.transaction();

    try{
        const {amount, discription, catagory} = req.body;
        const expense = await Expense.create({amount, discription, catagory, userId: req.user.id}, {transaction: t});
        const total_expense = Number(req.user.total_expense) + Number(amount);
        await User.update({total_expense}, {
            where: {
                id: req.user.id
            },
            transaction: t
        });
        await t.commit();
        res.json({success: true, ...expense.dataValues});
    } catch(err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success: false, message: 'Internal Srver Error'});
    }
}

exports.getExpenseById = async (req, res) => {
    const expenseId = req.params.id;
    try {
        const expense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });
        if(expense){
            res.json({success: true, ...expense.dataValues});
        } else {
            res.status(404).json({success: false, message: 'Expense Not Found'});
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, message: 'Internal Server Error'});
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id}});
        res.json([...expenses.map((expense) => expense.dataValues)]);
    } catch(err) {
        console.log(err);
        res.json({success: false, message: 'Internal Server Error'});
    }
}

exports.updateExpense = async (req, res) => {
    const expenseId = req.params.id;
    const { amount, description, category } = req.body;
    const t = await sequelize.transaction();

    try {    
        const [rowCount, updatedRows] = await Expense.update(
            { amount, description, category },
            {
                where: {
                    id: expenseId,
                    userId: req.user.id,
                },
                returning: true,
                transaction: t
            }
        );

        if (rowCount > 0) {
            const total_expense = Number(req.user.total_expense) - Number(updatedRows[0].amount) + Number(amount);
            await User.update({total_expense}, {
                where: {
                    id: req.user.id
                },
                transaction: t
            });
            await t.commit();
            res.json({ success: true, ...{ id: expenseId, amount, description, category } });
        } else {
            await t.rollback();
            res.status(404).json({ success: false, message: 'Expense Not Found' });
        }
    } catch (err) {
        await rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.deleteExpense = async (req, res) => {
    const expenseId = req.params.id;
    const t = await sequelize.transaction();

    try {
        const expenseById = await Expense.findOne({ where: { id: expenseId, userId: req.user.id }});
        const deletedRows = await Expense.destroy({
            where: {
                id: expenseId,
                userId: req.user.id,
            },
            transaction: t
        });

        if (deletedRows > 0) {
            const total_expense = Number(req.user.total_expense) - Number(expenseById.amount);
            await User.update({total_expense}, {
                where: {
                    id: req.user.id,
                },
                transaction: t
            });
            await t.commit();
            res.json({ success: true, ...expenseById.dataValues });
        } else {
            await t.rollback();
            res.status(404).json({ success: false, message: 'Expense Not Found' });
        }
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
