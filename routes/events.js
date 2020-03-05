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
let isConnected = require('../middleware/isConnected')
let isAdmin = require('../middleware/isAdmin')
let url = require ('url')
let uri = require ('uri-js')


router.get('/', isConnected, function(req, res) {
  id = req.baseUrl
  console.log(id);
  event.getAll(function(events){
    //vérifier si l'utilisateur est bien connecté avec les cookies
    res.render('events', {events: events})
  });
});

router.get('/summaryEvent/:id',isConnected, function(req, res){
  let id = req.originalUrl.split('/')[3]
  event.getEvent(id, function(event){
    console.log(event);
    res.render('summaryEvent', {event: event})
  });
});

router.get('/createEvent',isConnected, isAdmin, function(req, res) {
      event.getType(function(types){
        id = req.baseUrl
        console.log(id);
        res.render('createEvent', {types: types})
      });
  });

router.post('/createEvent', function(req, res) {
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
    event.createEvent(req.body.type, req.body.name, req.body.capacity, req.body.dateE, req.body.dateI, dist, req.body.team, 0, req.body.imgE, function(){
      //mettre dans le cookie que l'événement a bien été crééer
      res.redirect('/events');
    });
  }
});

module.exports = router;
