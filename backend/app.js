const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const sequelize = require('./utils/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');


const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/user', expenseRoutes);

sequelize
    .sync({force: true})
    .then((res) => {
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    })