var express = require('express');
var router = express.Router();


const EMAIL_REGEXE = /^[a-z]+-?[a-z]+\.[a-z]+-?[a-z]+@etu\.umontpellier\.fr$/
const EMAIL_REGEXP = /^[a-z]+-?[a-z]+\.[a-z]+-?[a-z]+@umontpellier\.fr$/
const NAME_REGEX = /^[a-z]+-?[a-z]+\.[a-z]+-?[a-z]+@umontpellier\.fr$/


router.get('/', function(req, res, next) {
  res.render('connexion');
});
router.get('/test', function(req, res, next) {
  res.render('test');
});

router.post('/', function(req, res, next) {
  if (req.body.mail === undefined || req.body.mail === "") {
     res.render('connexion', {error : "vous devez rentrer un email"});
  }
  else if (req.body.mdp === undefined || req.body.mdp === "") {
      res.render('connexion', {error : "vous devez rentrer un mdp"});
   }
   else {
     let user = require('../models/user.js')
     user.findOne(req.body.mail, function (result){
       console.log(result[0]);
       if (result[0] != undefined){
         if (result[0].mdp != req.body.mdp){
             res.render('connexion', {error : "Erreur dans le mot de passe"})
           }
           else {
             res.render('index', {success : "Vous êtes bien connecté"});
           }
       }
       else {
         res.render('connexion', {error : "Cette adresse mail n'a pas de compte"});
       }
     });
   }
});

router.get('/register', function(req, res, next) {
  let user = require('../models/user.js')
  user.getDep(function(deps){
    res.render('register', {deps: deps})
  });
});

router.post('/register', function(req, res, next) {
  console.log(req.body);
  console.log(!EMAIL_REGEXE.test(req.body.mail));
  if (req.body.mail === undefined || req.body.mail === "") {
    res.render('register', {error : "Vous devez rentrer un email"});
    console.log(1);
  }
  else if (!(EMAIL_REGEXE.test(req.body.mail))) {
    res.render('register', {error : "Vous devez rentrer votre adresse de Polytech"});
    console.log(2);
  }
  else if (req.body.mdp === undefined || req.body.mdp === "") {
    res.render('register', {error : "Vous devez rentrer un mdp"});
    console.log(3);
   }
  else if (req.body.mdp2 === undefined || req.body.mdp2 === "") {
    res.render('register', {error : "Vous devez confirmer votre mot de passe"});
    console.log(4);
    }
  else if (req.body.mdp != req.body.mdp2) {
    res.render('register', {error : "Les mot de passe ne correspondent pas"});
    console.log(5);
     }
  else if (req.body.lastname === undefined || req.body.lastname === "") {
    res.render('register', {error : "Vous devez rentrer votre nom"});
    console.log(6);
  }
  else if (req.body.firstname === undefined || req.body.firstname === "") {
    res.render('register', {error : "Vous devez rentrer votre prénom"});
    console.log(7);
   }
  else if (req.body.birth === undefined || req.body.birth === "") {
    res.render('register', {error : "Vous devez rentrer votre date de naissance"});
    console.log(8);
    }
  else {
     let user = require('../models/user.js');
     user.register(req.body.mail, req.body.mdp2, req.body.lastname, req.body.firstname, req.body.birth, req.body.departmt, function(){
       res.render('connexion', {success : "Vous êtes bien inscrit"});
     });
   }
});

module.exports = router;
