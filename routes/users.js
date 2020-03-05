var express = require('express');
var router = express.Router();
let user = require('../models/user.js')
let jwtUtils = require('../utils/jwt.utils')
let passwordHash = require('password-hash')
let isConnected = require('../middleware/isConnected')
let isAdmin = require('../middleware/isAdmin')
let jwt = require('jsonwebtoken')
let moment = require('moment-fr')
const JWT_SIGN_SECRET = '19ljbiPiàji097gytr'


const EMAIL_REGEXE = /^[a-z]+-?[a-z]+\.[a-z]+-?[a-z]+@etu\.umontpellier\.fr$/
const EMAIL_REGEXP = /^[a-z]+-?[a-z]+\.[a-z]+-?[a-z]+@umontpellier\.fr$/
const NAME_REGEX = /^[a-z]+-?[a-z]+\.[a-z]+-?[a-z]+@umontpellier\.fr$/
var algo = 'aes256'
var password = 'almfinz'

router.get('/', function(req, res) {
  res.render('connexion');
});


router.post('/', function(req, res) {
  if (req.body.mail === undefined || req.body.mail === "") {
    //"vous devez rentrer un email"
     res.status(401).redirect('users');
     console.log(1);
  }

  else if (req.body.mdp === undefined || req.body.mdp === "") {
    //vous devez rentrer un mdp
      res.status(401).redirect('users');
      console.log(1);
   }

   else {
     user.findOne(req.body.mail, function (result){
       if (result[0] != undefined){
         if (!passwordHash.verify(req.body.mdp, result[0].mdp)){
              //erreur le mot de passe n'est pas bon
             res.status(404).redirect('users')
             console.log("mdp pas bon");
           }

           else {
             //success il est bien connecté
             var token = jwtUtils.generateTokenForUser(result[0]);
             res.cookie("jwt", token, { expires: new Date(Date.now() + 2 * 3600000), httpOnly: true }); //2 heures
             console.log("cookie ok");
             res.status(201).redirect('/')
             }
       }

       else {
         //erreur, cette adresse mail n'a pas de compte
         res.status(401).redirect('users');
         console.log("pas adresse mail");
       }
     });
   }
});

router.get('/register', function(req, res) {
  user.getDep(function(deps){
    res.render('register', {deps: deps})
  });
});

router.get('/profil',isConnected, function(req, res){
  const cookie = req.cookies['jwt'];
  var token_decoded = jwt.verify(cookie, JWT_SIGN_SECRET)
  let userId = token_decoded.userId;
  user.findOne(userId, function(rows){
    res.render('profil', {rows: rows})
  });
});

router.post('/register', function(req, res) {
  //on vérifie si tous les inputs sont bien remplis, même s'il y a un require dans la view
  if (req.body.mail === undefined || req.body.mail === "") {
    //mettre le cas d'erreur dans un cookie "oublie du nom du mail"
     res.redirect('register');
     console.log(1);
   }
   // on regarde si le mail est bien de la forme etu.umontpellier.fr ou umontpellier.fr
   else if (!(EMAIL_REGEXE.test(req.body.mail))) {
    //mettre le cas d'erreur dans un cookie "adresse mail pas la bonne forme"
    res.redirect('register');
    console.log(2);
   }

   else if (req.body.mdp === undefined || req.body.mdp === "") {
     //mettre le cas d'erreur dans un cookie "oublie du mdp"
     res.redirect('register');
     console.log(3);
    }

   else if (req.body.mdp2 === undefined || req.body.mdp2 === "") {
       //mettre le cas d'erreur dans un cookie "oublie de mdp2"
     res.redirect('register');
     console.log(4);
     }

   else if (req.body.mdp != req.body.mdp2) {
       //mettre le cas d'erreur dans un cookie "mdps correspondent pas"
     res.redirect('register');
     console.log(5);
      }

   else if (req.body.lastname === undefined || req.body.lastname === "") {
       //mettre le cas d'erreur dans un cookie "oublie du nom"
     res.redirect('register');
     console.log(6);
   }

   else if (req.body.firstname === undefined || req.body.firstname === "") {
       //mettre le cas d'erreur dans un cookie "oublie du prénom"
     res.redirect('register');
     console.log(7);
    }

   else if (req.body.birth === undefined || req.body.birth === "") {
       //mettre le cas d'erreur dans un cookie "oublie de la date de naissance"
     res.redirect('register');
     console.log(8);
     }

else {
  user.findOne(req.body.mail, function(result){

    if (result[0] === undefined) { //vérifie si l'adresse mail est déjà associée à un compte
      var hashed = passwordHash.generate(req.body.mdp);
      let date = moment(req.body.birth)
      date = date.format('l');
      console.log(date);
      user.register(req.body.mail, hashed, req.body.lastname, req.body.firstname, req.body.birth, req.body.departmt, function(){
          //success "il est bien inscrit"
          console.log("connecté");
          res.status(201);
          res.redirect('/');
      });
    }

    else {
        //mettre le cas d'erreur dans un cookie "addresse mail déjà un compte"
        console.log("deja un compte");
        res.redirect('/');
    }
   });
 }
});

router.get("/logout", isConnected, function(req, res){
  res.clearCookie("jwt")
  res.redirect('/')
});

module.exports = router;
