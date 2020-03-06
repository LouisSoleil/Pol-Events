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
let moment = require ('moment-fr')


router.get('/', isConnected, function(req, res) {
  evenement.getAllU(function(events){
    //vérifier si l'utilisateur est bien connecté avec les cookies
    res.render('events', {events: events})
  });
});

router.get('/summaryEvent/:id',isConnected, isReserved, function(req, res){
  let id = req.originalUrl.split('/')[3]
  evenement.getEvent(id, function(event){
    event[0].dateEvent = moment(event[0].dateEvent).format('L')
    event[0].dateFinInscr = moment(event[0].dateFinInscr).format('L')
    res.render('summaryEvent', {event: event})
  });
});

router.get('/summaryEvent/:id/reserve', isConnected, function(req, res){
  let id = req.originalUrl.split('/')[3];
  var mail = req.user.userId;
  evenement.getEvent(id, function(event){
    if (moment().format('YYYY[-]MM[-]DD') < moment(event[0].dateFinInscr).format('YYYY[-]MM[-]DD')) {
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
    }
    else {
      res.redirect('/events/summaryEvent/'+id)
      console.log("Trop tard pour s'inscrire");
    }
    });
});

router.get('/summaryEvent/:id/deleteOne', isConnected, isReserved, function(req, res){
  let id = req.originalUrl.split('/')[3];
  mail = req.user.userId;
  evenement.getEvent(id, function(event){
    var newCap = event[0].nbMaxParticipant + 1;
    evenement.modifyNb(id, newCap, function(){
      resa.deleteResa(id, mail, function(){
        res.redirect('/events/summaryEvent/'+id)
      });
    });
  });
});




module.exports = router;
