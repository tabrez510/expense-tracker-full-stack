const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense');

router.get('/expenses', expenseController.getExpenses);
router.get('/expenses/:id', expenseController.getExpenseById);
router.post('/expenses', expenseController.createExpense);
router.put('/expenses/:id', expenseController.updateExpense);
router.delete('/expenses/:id', expenseController.deleteExpense);

module.exports = router;