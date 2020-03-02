var express = require('express');
var router = express.Router();
let user = require('../models/user.js')


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
     user.findOne(req.body.mail, function (result){
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
  user.getDep(function(deps){
    res.render('register', {deps: deps})
  });
});

router.post('/register', function(req, res, next) {
  //on vérifie si tous les inputs sont bien remplis, même s'il y a un require dans la view
  if (req.body.mail === undefined || req.body.mail === "") {
    //mettre le cas d'erreur dans un cookie "oublie du nom du mail"
     res.redirect('register');
   }
   // on regarde si le mail est bien de la forme etu.umontpellier.fr ou umontpellier.fr
   else if (!(EMAIL_REGEXE.test(req.body.mail))) {
    //mettre le cas d'erreur dans un cookie "adresse mail pas la bonne forme"
    res.redirect('register');
   }

   else if (req.body.mdp === undefined || req.body.mdp === "") {
     //mettre le cas d'erreur dans un cookie "oublie du mdp"
     res.redirect('register');
    }

   else if (req.body.mdp2 === undefined || req.body.mdp2 === "") {
       //mettre le cas d'erreur dans un cookie "oublie de mdp2"
     res.redirect('register');
     }

   else if (req.body.mdp != req.body.mdp2) {
       //mettre le cas d'erreur dans un cookie "mdps correspondent pas"
     res.redirect('register');
      }

   else if (req.body.lastname === undefined || req.body.lastname === "") {
       //mettre le cas d'erreur dans un cookie "oublie du nom"
     res.redirect('register');
   }

   else if (req.body.firstname === undefined || req.body.firstname === "") {
       //mettre le cas d'erreur dans un cookie "oublie du prénom"
     res.redirect('register');
    }

   else if (req.body.birth === undefined || req.body.birth === "") {
       //mettre le cas d'erreur dans un cookie "oublie de la date de naissance"
     res.redirect('register');
     }

else {
  user.findOne(req.body.mail, function(result){

    if (result[0] === undefined) { //vérifie si l'adresse mail est déjà associée à un compte
      user.register(req.body.mail, req.body.mdp2, req.body.lastname, req.body.firstname, req.body.birth, req.body.departmt, function(){
          //success "il est bien inscrit"
        res.redirect('connexion');
      });
    }

    else {
        //mettre le cas d'erreur dans un cookie "addresse mail déjà un compte"
      res.redirect('connexion');
    }
   });
 }
});

module.exports = router;
