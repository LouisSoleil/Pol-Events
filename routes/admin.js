var express = require('express');
var router = express.Router();
let isConnected = require('../middleware/isConnected');
let isAdmin = require('../middleware/isAdmin');
let evenement = require('../models/event.js');
let resa = require('../models/resa.js');
let moment = require('moment-fr');
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');


router.get('/', isConnected, isAdmin, function(req, res) {
  res.render('indexAdmin')
});

router.get('/events', isConnected, isAdmin, function(req, res) {
  evenement.getAll(function(events){
    //vérifier si l'utilisateur est bien connecté avec les cookies
    res.render('eventsAdmin', {events: events})
  });
});

router.get('/events/summaryEventAdmin/:id',isConnected, isAdmin, function(req, res){
  let id = req.originalUrl.split('/')[4]
  console.log(req.originalUrl);
  evenement.getEvent(id, function(event){
    event[0].dateEvent = moment(event[0].dateEvent).format('YYYY[-]MM[-]DD')
    event[0].dateFinInscr = moment(event[0].dateFinInscr).format('YYYY[-]MM[-]DD')
    res.render('summaryEventAdmin', {event: event})
  });
});

router.get('/events/summaryEventAdmin/:id/members',isConnected, isAdmin, function(req, res){
  let id = req.originalUrl.split('/')[4]
  var i = 0;
  evenement.getParticEvent(id, function(members){
    for (member of members){
      member.dateNaissance = moment(member.dateNaissance).format('L');
    }
    res.render('List', {members: members});
  });
});

router.get('/events/createEvent',isConnected, isAdmin, function(req, res) {
  evenement.getType(function(types){
    res.render('createEvent', {types: types})
  });
});

router.post('/events/createEvent', isConnected, isAdmin, function(req, res) {
  //on vérifie si tous les inputs sont bien remplis, même s'il y a un require dans la view
  if (req.body.name === undefined || req.body.name === "") {
    //mettre le cas d'erreur dans un cookie "oublie du nom de l'événement"
    console.log(1);
    res.redirect('events/CreateEvent');
  }

  else if (req.body.dateE === undefined || req.body.dateE === "") {
    //mettre le cas d'erreur dans un cookie "oublie de la date de l'événement"
    console.log(2);
    res.redirect('events/CreateEvent');
   }

  else if (req.body.capacity === undefined || req.body.capacity === "") {
    //mettre le cas d'erreur dans un cookie "oublie du nombre max de participant"
    console.log(3);
    res.redirect('events/CreateEvent');
  }

  else if (req.body.dateI === undefined || req.body.dateI === "") {
    //mettre le cas d'erreur dans un cookie "oublie de la date de fin d'inscription"
    console.log(4);
    res.redirect('events/CreateEvent');
   }

  else {
    evenement.createEvent(req.body.type, req.body.name, req.body.capacity, req.body.dateE, req.body.dateI, 0, req.body.imgE, function(){
      //mettre dans le cookie que l'événement a bien été crééer
      console.log(5);
      res.redirect('/admin/events');
    });
  }
});

router.post('/events/summaryEventAdmin/:id', isConnected, isAdmin, function(req, res) {
  //on vérifie si tous les inputs sont bien remplis, même s'il y a un require dans la view
  let id = req.originalUrl.split('/')[4]
  if (req.body.name === undefined || req.body.name === "") {
    //mettre le cas d'erreur dans un cookie "oublie du nom de l'événement"
    console.log(1);
    res.redirect(req.originalUrl);
  }

  else if (req.body.dateE === undefined || req.body.dateE === "") {
    //mettre le cas d'erreur dans un cookie "oublie de la date de l'événement"
    console.log(2);
    res.redirect(req.originalUrl);
   }

  else if (req.body.capacity === undefined || req.body.capacity === "") {
    //mettre le cas d'erreur dans un cookie "oublie du nombre max de participant"
    console.log(3);
    res.redirect(req.originalUrl);
  }

  else if (req.body.dateI === undefined || req.body.dateI === "") {
    //mettre le cas d'erreur dans un cookie "oublie de la date de fin d'inscription"
    console.log(4);
    res.redirect(req.originalUrl);
   }

  else {
    evenement.modifyEvent(id, req.body.name, req.body.capacity, req.body.dateE, req.body.dateI, req.body.etat, function(){
      //mettre dans le cookie que l'événement a bien été crééer
      res.redirect('/admin/events');
    });
  }
});

router.get('/events/delete/:id',isConnected, isAdmin, function(req, res){
  let id = req.originalUrl.split('/')[4]
  console.log('coucou');
  resa.deleteAllResa(id, function(){
    evenement.deleteEvent(id, function(){
      res.redirect('/admin/events')
    })
  });
});



module.exports = router;
