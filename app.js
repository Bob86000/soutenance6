const express = require('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require('path');
var helmet = require('helmet');
const limiter = require('./middleware/rate-limiter');
const mongoSanitize = require('express-mongo-sanitize');// ne marche pas
var hpp = require('hpp');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


mongoose.connect(process.env.DB_URI,   
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true, })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

 

//DB_URI=mongodb+srv://<`${NAME}`>:<`${PASSWORD}`>@cluster0.uiu95.mongodb.net/<`${DB_NAME}`>?retryWrites=true&w=majority
/*
mongodb+srv://<username>:<password>@cluster0.uiu95.mongodb.net/<dbname>?retryWrites=true&w=majority 
mongoose.connect('mongodb+srv://Fgt158-cc:Fgt158-cc@cluster0.uiu95.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true, })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  montrer 2 utilisateur avec  2 role différent pour qu'on ai un administrateur qui a plus de possibilité de contenu
  montrer l'ecran

  security pa voir du user du mot de passe,

  masquer fichier dotenv configurer des variable qui correspond ,

  changer les cluster aussi et la DB. avec dotenv , creer un fichier readme expliquant comment substituer le env-exemple.file faux par un vrai env.file


  que dans les livrables pas dans le code , et lexaminateur utilise  sa base , 2 -3 utilisateur deux ou 3 sauce, image de sauce sur github


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

app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(hpp());

app.use(mongoSanitize());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;