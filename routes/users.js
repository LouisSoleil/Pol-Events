var express = require('express');
var router = express.Router();
let user = require('../models/user.js')
let jwtUtils = require('../utils/jwt.utils')
let passwordHash = require('password-hash')
let getMsg = require('../middleware/getMsg')
let isConnected = require('../middleware/isConnected')
let isAdmin = require('../middleware/isAdmin')
let jwt = require('jsonwebtoken')
let moment = require('moment-fr')
const JWT_SIGN_SECRET = '19ljbiPiàji097gytr'


const EMAIL_REGEXE = /^[a-z]+-?[a-z]+\.[a-z]+-?[a-z]+@etu\.umontpellier\.fr$/
const EMAIL_REGEXP = /^[a-z]+-?[a-z]+\.[a-z]+-?[a-z]+@umontpellier\.fr$/
var algo = 'aes256'
var password = 'almfinz'

router.get('/', getMsg, function(req, res){
  res.render('connexion')
});

router.post('/', function(req, res) {
  if (req.body.mail === undefined || req.body.mail === "") {
    res.cookie('Success', "Vous devez rentrer une adresse mail de polytech.", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
     res.status(401).redirect('users');
  }

  else if (req.body.mdp === undefined || req.body.mdp === "") {
    res.cookie('Success', "Vous devez rentrer un mot de passe.", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
      res.status(401).redirect('users');
   }

   else {
     user.findOne(req.body.mail, function (result){
       if (result[0] != undefined){
         if (!passwordHash.verify(req.body.mdp, result[0].mdp)){
           res.cookie('Success', "Le mot de passe n'est pas bon.", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
            res.status(404).redirect('users')
           }

           else {
             var token = jwtUtils.generateTokenForUser(result[0]);
             res.cookie("jwt", token, { expires: new Date(Date.now() + 2 * 3600000), httpOnly: true }); //2 heures
             res.status(201).redirect('/')
             }
       }

       else {
         res.cookie('Success', "Cette adresse mail n'est pas associé à un compte.", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
         res.status(401).redirect('users');
       }
     });
   }
});

router.get('/register', getMsg, function(req, res) {
  user.getDep(function(deps){
    res.render('register', {deps: deps})
  });
});

router.post('/register', function(req, res) {
  //on vérifie si tous les inputs sont bien remplis, même s'il y a un require dans la view
  if (req.body.mail === undefined || req.body.mail === "") {
    res.cookie('Success', "Vous n'avez pas renseigné d'adresse mail", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
     res.redirect('register');
   }
   // on regarde si le mail est bien de la forme etu.umontpellier.fr ou umontpellier.fr
   else if (!(EMAIL_REGEXE.test(req.body.mail))) {
    res.cookie('Success', "Vous devez mettre votre adresse mail de polytech", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
    res.redirect('register');
   }

   else if (req.body.mdp === undefined || req.body.mdp === "") {
     res.cookie('Success', "Vous devez mettre un mot de passe", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
     res.redirect('register');
    }

   else if (req.body.mdp2 === undefined || req.body.mdp2 === "") {
    res.cookie('Success', "Vous n'avez pas rempli le champs du 2éme mot de passe", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
    res.redirect('register');
    }

   else if (req.body.mdp != req.body.mdp2) {
    res.cookie('Success', "Les mots de passe ne correspondent pas", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
    res.redirect('register');
  }

   else if (req.body.lastname === undefined || req.body.lastname === "") {
    res.cookie('Success', "Vous devez rensignez votre nom", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
     res.redirect('register');
   }

   else if (req.body.firstname === undefined || req.body.firstname === "") {
    res.cookie('Success', "Vous devez renseigner votre prénom", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
     res.redirect('register');
    }

   else if (req.body.birth === undefined || req.body.birth === "") {
    res.cookie('Success', "Vous devez renseigner votre date de naissance", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
     res.redirect('register');
     }

else {
  user.findOne(req.body.mail, function(result){

    if (result[0] === undefined) { //vérifie si l'adresse mail est déjà associée à un compte
      var hashed = passwordHash.generate(req.body.mdp);
      let date = moment(req.body.birth).format('YYYY[-]MM[-]DD');
      user.register(req.body.mail, hashed, req.body.lastname, req.body.firstname, date, req.body.departmt, function(){
          res.cookie('Success', "Vous êtes bien inscrit", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
          res.status(201);
          res.redirect('/');
      });
    }

    else {
        res.cookie('Success', "Cette adresse mail est déjà associée à un compte", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
        res.redirect('/');
    }
   });
 }
});

router.get('/profil',isConnected, getMsg, function(req, res){
  const cookie = req.cookies['jwt'];
  var token_decoded = jwt.verify(cookie, JWT_SIGN_SECRET)
  let userId = token_decoded.userId;
  user.findOne(userId, function(rows){
    user.getDep(function(deps){
      rows[0].dateNaissance = moment(rows[0].dateNaissance).format('YYYY[-]MM[-]DD');
      res.render('profil', {rows: rows, deps: deps})
    });
  });
});

router.post('/profil', isConnected, function(req, res) {
  user.findOne(req.user.userId, function(result) {
    if (req.body.departmt === undefined){
      var dep = result[0].idDep
    }
    else {
      var dep = req.body.departmt
    }
    if (req.body.oldPsw === ''){
      let date = moment(req.body.birth).format('YYYY[-]MM[-]DD');
      user.modifyProfil(result[0].email, req.body.lastname, req.body.firstname, date, result[0].mdp, dep, function(){
        res.redirect('profil');
      });
    }
    else {
      if (passwordHash.verify(req.body.oldPsw, result[0].mdp)) {
        if (req.body.newPsw1 == req.body.newPsw2) {
          var psw = passwordHash.generate(req.body.newPsw1);
          let date = moment(req.body.birth).format('YYYY[-]MM[-]DD');
          user.modifyProfil(result[0].email, req.body.lastname, req.body.firstname, date, psw, dep, function(){
            res.redirect('profil')
          });
        }
        else {
          res.cookie('Success', "Les deux nouveaux mots de passe ne correspondent pas", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
          res.redirect('profil')
        }
      }
      else {
        res.cookie('Success', "Votre ancien mot de passe n'est pas bon", { expires: new Date(Date.now() + 2 * 1000), httpOnly: true });
        res.redirect('profil')
      }
    }
  });
});


router.get("/logout", isConnected, function(req, res){
  res.clearCookie("jwt")
  res.redirect('/')
});

module.exports = router;
