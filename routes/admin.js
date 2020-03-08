var express = require('express');
var router = express.Router();
let isConnected = require('../middleware/isConnected');
let isAdmin = require('../middleware/isAdmin');
let getMsg = require('../middleware/getMsg');
let evenement = require('../models/event.js');
let user = require('../models/user.js');
let resa = require('../models/resa.js');
let moment = require('moment-fr');
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');


router.get('/', isConnected, isAdmin, getMsg, function(req, res) {
  res.render('indexAdmin')
});

router.get('/events', isConnected, isAdmin, getMsg, function(req, res) {
  evenement.getAll(function(events){
    //vérifier si l'utilisateur est bien connecté avec les cookies
    res.render('eventsAdmin', {events: events})
  });
});

router.get('/search', isConnected, isAdmin, getMsg, function(req, res) {
  res.locals.isPeople = 1;
  user.getAll(function(members){
    for (member of members){
      member.dateNaissance = moment(member.dateNaissance).format('L');
    }
    res.render('List', {members: members})
  });
});

router.post('/search', isConnected, isAdmin, function(req, res) {
  res.locals.isPeople = 1;
  user.findOne(req.body.search, function(members){
    for (member of members){
      member.dateNaissance = moment(member.dateNaissance).format('L');
    }
    res.render('List', {members: members})
  });
});

router.get('/search/profilAdmin/:mail', isConnected, isAdmin, getMsg, function(req, res) {
  let mail = req.originalUrl.split('/')[4]
  user.findOne(mail, function(member){
    member[0].dateNaissance = moment(member[0].dateNaissance).format('L');
    res.render('profilAdmin', {member: member})
  });
});

router.post('/search/profilAdmin/:mail', isConnected, isAdmin, function(req, res) {
  let mail = req.originalUrl.split('/')[4]
  user.updateAdmin(mail, req.body.etat, function(){
    res.redirect('/admin/search/profilAdmin/'+mail)
  });
});

router.get('/events/summaryEventAdmin/:id',isConnected, isAdmin, getMsg, getMsg, function(req, res){
  let id = req.originalUrl.split('/')[4]
  evenement.getEvent(id, function(event){
    event[0].dateEvent = moment(event[0].dateEvent).format('YYYY[-]MM[-]DD')
    event[0].dateFinInscr = moment(event[0].dateFinInscr).format('YYYY[-]MM[-]DD')
    res.render('summaryEventAdmin', {event: event})
  });
});

router.post('/events/summaryEventAdmin/:id', isConnected, isAdmin, function(req, res) {
  //on vérifie si tous les inputs sont bien remplis, même s'il y a un require dans la view
  let id = req.originalUrl.split('/')[4]
  if (req.body.name === undefined || req.body.name === "") {
    res.cookie('Success', "Vous n'avez pas modifié le nom", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
    res.redirect(req.originalUrl);
  }

  else if (req.body.dateE === undefined || req.body.dateE === "") {
    res.cookie('Success', "Vous n'avez pas modifié la date de l'événement", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true })
    res.redirect(req.originalUrl);
   }

  else if (req.body.capacity === undefined || req.body.capacity === "") {
    res.cookie('Success', "Vous n'avez pas modifié la capacité", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
    res.redirect(req.originalUrl);
  }

  else if (req.body.dateI === undefined || req.body.dateI === "") {
    res.cookie('Success', "Vous n'avez pas modifié la date de fin d'inscription", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
    res.redirect(req.originalUrl);
   }

   else if (req.body.etat === undefined || req.body.etat === "") {
    evenement.getEvent(id, function (event) {
      etat = event[0].afficher
      evenement.modifyEvent(id, req.body.name, req.body.capacity, req.body.dateE, req.body.dateI, etat, function(){
        res.cookie('Success', "L'événement a bien été modifié", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
        res.redirect('/admin/events');
      });
    })
    }

  else {
    etat = req.body.etat
    evenement.modifyEvent(id, req.body.name, req.body.capacity, req.body.dateE, req.body.dateI, etat, function(){
      res.cookie('Success', "L'événement a bien été modifié", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
      res.redirect('/admin/events');
    });
  }
});

router.get('/events/summaryEventAdmin/:id/members',isConnected, isAdmin, getMsg, function(req, res){
  let id = req.originalUrl.split('/')[4]
  evenement.getParticEvent(id, function(members){
    evenement.getEvent(id, function(event){
      for (member of members){
        member.dateNaissance = moment(member.dateNaissance).format('L');
      }
      res.render('List', {members: members, event: event});
    });
  });
});

router.get('/events/summaryEvent/:id/:mail/deleteOneUser', isConnected, isAdmin, getMsg, function(req, res){
  let id = req.originalUrl.split('/')[4];
  let mail = req.originalUrl.split('/')[5];
  evenement.getEvent(id, function(event){
    var newCap = event[0].nbMaxParticipant + 1;
    evenement.modifyNb(id, newCap, function(){
      resa.deleteResa(id, mail, function(){
        res.cookie('Success', "La réservation a bien été supprimé", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
        res.redirect('/admin/events/summaryEventAdmin/'+id+'/members')
      });
    });
  });
});

router.get('/events/createEvent',isConnected, isAdmin, getMsg, function(req, res) {
  evenement.getType(function(types){
    res.render('createEvent', {types: types})
  });
});

router.post('/events/createEvent', isConnected, isAdmin, function(req, res) {
  //on vérifie si tous les inputs sont bien remplis, même s'il y a un require dans la view
  if (req.body.name === undefined || req.body.name === "") {
    res.cookie('Success', "Vous n'avez pas renseigné de nom", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
    res.redirect('events/CreateEvent');
  }

  else if (req.body.dateE === undefined || req.body.dateE === "") {
    res.cookie('Success', "Vous n'avez pas renseigné la date de l'événemement", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
    res.redirect('events/CreateEvent');
   }

  else if (req.body.capacity === undefined || req.body.capacity === "") {
    res.cookie('Success', "Vous n'avez pas renseigné le nombre de participant", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
    res.redirect('events/CreateEvent');
  }

  else if (req.body.dateI === undefined || req.body.dateI === "") {
    res.cookie('Success', "Vous n'avez pas renseigné le date de fin d'inscription", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
    res.redirect('events/CreateEvent');
   }

  else {
    evenement.createEvent(req.body.type, req.body.name, req.body.capacity, req.body.dateE, req.body.dateI, 0, req.body.imgE, function(){
      res.cookie('Success', "L'événement a bien été créé", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
      res.redirect('/admin/events');
    });
  }
});


router.get('/events/delete/:id',isConnected, isAdmin, getMsg, function(req, res){
  let id = req.originalUrl.split('/')[4]
  resa.deleteAllResa(id, function(){
    evenement.deleteEvent(id, function(){
      res.redirect('/admin/events')
    })
  });
});



module.exports = router;
