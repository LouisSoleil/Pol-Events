/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Quand je vais faire les cookies, il faut en crééer un pour mettre les messsages d'erreurs et quans je ferais un redirect je l'affiche
dans le cookie je mets un entier qui correspond à mon cas d'erreur
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

var express = require('express');
var router = express.Router();
let event = require('../models/event.js')
let user = require('../models/user.js')

router.get('/createEvent', function(req, res) {
  //vérifier si il est bien connecter en récupérant l'adresse mail dans le cookie
  user.isAdmin('louis.soleil@etu.umontpellier.fr' , function(result){
    if (result[0].isAdmin === 1){ //on vérifie si l'utilisateur connecté est bien un admin
      event.getType(function(types){
        res.render('createEvent', {types: types})
      });
    }
    else { //s'il ne l'est pas on le renvoie à la page d'accueil
      //mettre le cas d'erreur dans un cookie
      res.redirect('/');
    }
  });
});

router.post('/createEvent', function(req, res, next) {
  //on vérifie si tous les inputs sont bien remplis, même s'il y a un require dans la view
  if (req.body.name === undefined || req.body.name === "") {
    //mettre le cas d'erreur dans un cookie "oublie du nom de l'événement"
    res.redirect('CreateEvent');
  }

  else if (req.body.dateE === undefined || req.body.dateE === "") {
    //mettre le cas d'erreur dans un cookie "oublie de la date de l'événement"
    res.redirect('CreateEvent');
   }

  else if (req.body.capacity === undefined || req.body.capacity === "") {
    //mettre le cas d'erreur dans un cookie "oublie du nombre max de participant"
    res.redirect('CreateEvent');
  }

  else if (req.body.dateI === undefined || req.body.dateI === "") {
    //mettre le cas d'erreur dans un cookie "oublie de la date de fin d'inscription"
    res.redirect('CreateEvent');
   }
  else {
    let dist;
    dist == req.body.dist;
    event.createEvent(req.body.type, req.body.name, req.body.capacity, req.body.dateE, req.body.dateI, dist, req.body.team, 0, function(){
      //mettre dans le cookie que l'événement a bien été crééer
      res.redirect('index');
    });
  }
});

module.exports = router;
