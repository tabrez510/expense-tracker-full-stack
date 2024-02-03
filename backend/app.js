const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const sequelize = require('./utils/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const Expense = require('./models/expense');
const user = require('./models/user');
const expense = require('./models/expense');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/user', expenseRoutes);

user.hasMany(expense);
expense.belongsTo(user);

sequelize
    .sync({force: false})
    .then((res) => {
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    })