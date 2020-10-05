const express = require('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require('path');
var helmet = require('helmet');
const limiter = require('./middleware/rate-limiter');
const mongoSanitize = require('express-mongo-sanitize');
var hpp = require('hpp');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


mongoose.connect(process.env.DB_URI,   
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true, })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(limiter);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(mongoSanitize());
app.use(hpp());


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;