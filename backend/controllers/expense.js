const Expense = require('../models/expense');

exports.createExpense = async (req, res) => {

    try{
        const {amount, discription, catagory} = req.body;

        const expense = await Expense.create({amount, discription, catagory, userId: req.user.id});
        res.json({success: true, ...expense.dataValues});
    } catch(err) {
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

    try {
        const [updatedRows] = await Expense.update(
            { amount, description, category },
            {
                where: {
                    id: expenseId,
                    userId: req.user.id,
                },
            }
        );

        if (updatedRows > 0) {
            res.json({ success: true, ...{ id: expenseId, amount, description, category } });
        } else {
            res.status(404).json({ success: false, message: 'Expense Not Found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.deleteExpense = async (req, res) => {
    const expenseId = req.params.id;

    try {
        const expenseById = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });
        const deletedRows = await Expense.destroy({
            where: {
                id: expenseId,
                userId: req.user.id,
            },
        });

        if (deletedRows > 0) {
            
            res.json({ success: true, ...expenseById.dataValues });
        } else {
            res.status(404).json({ success: false, message: 'Expense Not Found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
