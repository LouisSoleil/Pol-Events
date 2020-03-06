/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Quand je vais faire les cookies, il faut en crééer un pour mettre les messsages d'erreurs et quans je ferais un redirect je l'affiche
dans le cookie je mets un entier qui correspond à mon cas d'erreur
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

var express = require('express');
var router = express.Router();
let evenement = require('../models/event.js')
let user = require('../models/user.js')
let resa = require('../models/resa.js')
let isConnected = require('../middleware/isConnected')
let isAdmin = require('../middleware/isAdmin')
let isReserved = require('../middleware/isReserved')
let uri = require ('uri-js')


router.get('/', isConnected, function(req, res) {
  evenement.getAllU(function(events){
    //vérifier si l'utilisateur est bien connecté avec les cookies
    res.render('events', {events: events})
  });
});

router.get('/summaryEvent/:id',isConnected, isReserved, function(req, res){
  let id = req.originalUrl.split('/')[3]
  evenement.getEvent(id, function(event){
    res.render('summaryEvent', {event: event})
  });
});

router.get('/summaryEvent/:id/reserve', isConnected, function(req, res){
  let id = req.originalUrl.split('/')[3];
  var mail = req.user.userId;
  evenement.getEvent(id, function(event){
    if (event[0].nbMaxParticipant > 0) {
      var newCap = event[0].nbMaxParticipant - 1;
      evenement.modifyNb(id, newCap, function(){
        resa.addResa(id, mail ,function(){
          console.log("ok");
          res.redirect('/events/summaryEvent/'+id)
        });
      });
    }
    else{
      res.redirect('/events/summaryEvent/'+id)
      console.log('évènement complet');
    }
  });
});

router.get('/summaryEvent/:id/delete', isConnected, isReserved, function(req, res){
  let id = req.originalUrl.split('/')[3];
  evenement.getEvent(id, function(event){
    var newCap = event[0].nbMaxParticipant + 1;
    evenement.modifyNb(id, newCap, function(){
      resa.deleteResa(id, function(){
        res.redirect('/events/summaryEvent/'+id)
      });
    });
  });
});

module.exports = router;
