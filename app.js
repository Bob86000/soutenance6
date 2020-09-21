const express = require('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const path = require('path');
var helmet = require('helmet');
const limiter = require('./middleware/rate-limiter');
// var mongoSanitize = require('mongo-express-sanitize');// ne marche pas

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


mongoose.connect('mongodb+srv://Fgt158-cc2:Fgt158-cc2@cluster0.uiu95.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true, })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* 
mongoose.connect('mongodb+srv://Fgt158-cc:Fgt158-cc@cluster0.uiu95.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true, })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


*/  


const app = express();
app.use(limiter);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());

//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//app.use(mongoSanitize());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;