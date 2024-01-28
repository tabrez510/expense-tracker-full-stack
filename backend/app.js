const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const sequelize = require('./utils/database');
const singupRoutes = require('./routes/signup');


const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', singupRoutes);

sequelize
    .sync()
    .then((res) => {
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    })