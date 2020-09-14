const Sauce = require('../models/sauce');
const Like = require('../models/like')
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject, //title: req.body.title copie les champs qu'il y a dans la body de la requete et va detaillé les propriétés objets
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      userslikes : ["0"],
      usersDisliked: ['0']
    });
    sauce.save()
      .then(() => res.status(201).json({ message: "objet enregistré !" }))
      .catch((error) => res.status(400).json({ error }));
};

/*exports.modifySauceLikes = (req, res, next) => {
    Like.findOne({ id: req.params.id })
    .then((found) => {
        if (!found) {
            const like = new Like({
                id : req.params.id
              });
              like.arrayId.push({ user: req.body.usersID, like : req.body.like});
              Sauce.findOne({ _id: req.params.id })
              .then((sauce)=> { 
                  const newLike = sauce.likes+req.body.like;
                  Sauce.updateOne({ _id: req.params.id }, { likes : newLike})
                .then(() => res.status(200).json({ message: "objet modifié !" }))
                .catch((error) => res.status(400).json({ error }));
              }
              )
              .catch(error => res.status(500).json({ error }));
        }
        let userId = userId || [] ;
        let user = userId.find((req) => req.body.userId === user);
        if ( user === undefined)
        {
            let indexUser = {
                user
            }
        }
        

        if (req.body.like = 0 ) {  
    } /*
    /*if (req.body.like = 0 ) {
        console.log('mise a jour');
        Like.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "like modifié !" }))
        .catch((error) => res.status(400).json({ error }))
    } else { })
        console.log(req.body.like);
        like.save()
        .then(() => res.status(201).json({ message: "like enregistré !" }))
        .catch((error) => res.status(400).json({ error }))
    }*/


exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: "objet modifié !" }))
      .catch((error) => res.status(400).json({ error }));
};
    

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "objet supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
    

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => res.status(200).json(sauce))
      .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({ error }));
};