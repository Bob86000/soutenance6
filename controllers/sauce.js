const Sauce = require('../models/sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject, //title: req.body.title copie les champs qu'il y a dans la body de la requete et va detaillé les propriétés objets
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked : [], //modifier la syntaxe par usersLikes et toute les occurences
      usersDisliked: []
    });
    sauce.save()
      .then(() => res.status(201).json({ message: "objet enregistré !" }))
      .catch((error) => res.status(400).json({ error }));
};

exports.modifySauceLikes = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // modify number likes and dislikes
      let likes = sauce.likes;
      let dislike = sauce.dislikes;
      // modify array usersliked and usersDIsliked
      let newUsersId = req.body.userId;
      let usersLiked = sauce.usersLiked;
      let usersDisliked = sauce.usersDisliked;
      // search if userslikes or usersdislike already exist
      let findUsersLiked = usersLiked.find((user) => user == req.body.userId);
      let findUsersDisliked = usersDisliked.find((user) => user == req.body.userId);
      if (req.body.like == 1 && findUsersLiked === undefined) {
        sauce.likes++;
        let newLikes = sauce.likes;
        usersLiked.push(newUsersId);
        let newUsersLiked = usersLiked;
        Sauce.updateOne({ _id: req.params.id }, { likes : newLikes, usersLiked : newUsersLiked })
        .then(() => res.status(200).json({ message: "Like ajouté!" }))
        .catch((error) => res.status(400).json({ error })); 
      }
      if (req.body.like == 0) {
          if (findUsersLiked !== undefined) {
          sauce.likes--;
          let newLikes = sauce.likes;
          let indexToDelete = usersLiked.indexOf(req.body.userId);
          usersLiked.splice(indexToDelete,1);
          let newUsersLiked = usersLiked;
          Sauce.updateOne({ _id: req.params.id }, { likes : newLikes, usersLiked : newUsersLiked })
          .then(() => res.status(200).json({ message: "Like annulé !" }))
          .catch((error) => res.status(400).json({ error })); 
          }
          if (findUsersDisliked !== undefined) {
            sauce.dislikes--;
            let newDislikes = sauce.dislikes;
            let indexToDelete = usersDisliked.indexOf(req.body.userId);
            usersDisliked.splice(indexToDelete,1);
            let newUsersDisliked = usersDisliked;
            Sauce.updateOne({ _id: req.params.id }, { dislikes : newDislikes, usersDisliked : newUsersDisliked })
            .then(() => res.status(200).json({ message: "Dislike annulé !" }))
            .catch((error) => res.status(400).json({ error })); 
            }
        }
      if (req.body.like == -1 && findUsersDisliked === undefined) {
        sauce.dislikes++;
        let newDislike = sauce.dislikes;
        usersDisliked.push(newUsersId);
        let newUsersDisliked = usersDisliked;
        Sauce.updateOne({ _id: req.params.id }, { dislikes : newDislike, usersDisliked : newUsersDisliked})
        .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
        .catch((error) => res.status(400).json({ error }));
      } 
})
.catch((error) => res.status(500).json({ error }))
}


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