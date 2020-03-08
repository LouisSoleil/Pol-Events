var express = require('express');
var router = express.Router();
let isConnected = require('../middleware/isConnected')
let getMsg = require('../middleware/getMsg')
let isAdmin = require('../middleware/isAdmin')

router.get('/', isConnected, getMsg, function(req, res) {
  var user = req.user
  var id = req.originalUrl.split('/')[2]
  if (user.isAdmin === 1){
    if (id === "admin"){
      res.render('index', {head: ('head/headerA.ejs') });
     }
    else {
      res.render('index', {head: ('head/headerUA') })
    }
  }
  else {
     res.render('index', {head: ('head/headerU') })
  }
});



module.exports = router;
