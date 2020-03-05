var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});



module.exports = router;
