var express = require('express');
var router = express.Router();

/* GET users listing. */
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
     user.signin(req.body.mail, req.body.mdp, function(){
       console.log("succes");
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
  if (req.body.mail === undefined || req.body.mail === "") {
    res.render('register', {error : "Vous devez rentrer un email"});
  }
  else if (req.body.mdp === undefined || req.body.mdp === "") {
    res.render('register', {error : "Vous devez rentrer un mdp"});
   }
  else if (req.body.mdp2 === undefined || req.body.mdp2 === "") {
    res.render('register', {error : "Vous devez confirmer votre mot de passe"});
    }
  else if (req.body.mdp != req.body.mdp2) {
    res.render('register', {error : "Les mot de passe ne correspondent pas"});
     }
  else if (req.body.lastname === undefined || req.body.lastname === "") {
    res.render('register', {error : "Vous devez rentrer votre nom"});
  }
  else if (req.body.firstname === undefined || req.body.firstname === "") {
    res.render('register', {error : "Vous devez rentrer votre prénom"});
   }
  else if (req.body.birth === undefined || req.body.birth === "") {
    res.render('register', {error : "Vous devez rentrer votre date de naissance"});
    }
  else {
     let user = require('../models/user.js');
     user.register(req.body.mail, req.body.mdp2, req.body.lastname, req.body.firstname, req.body.birth, req.body.departmt, function(){
       res.render('index');
     });
   }
});

module.exports = router;
