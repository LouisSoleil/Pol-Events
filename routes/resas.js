var express = require('express');
var router = express.Router();
let resa = require('../models/resa.js')
let isConnected = require('../middleware/isConnected')
let getMsg = require('../middleware/getMsg')
let isResa = require('../middleware/isResa')
let isReserved = require('../middleware/isReserved')
let isAdmin = require('../middleware/isAdmin')

router.get('/', isConnected, isResa, getMsg, function(req, res) {
  let mail = req.user.userId;
  resa.getResaEvent(mail, function(events){
    console.log(events);
    res.render('events', {events: events})
  });
});

module.exports = router;
