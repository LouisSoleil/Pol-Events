let resa = require('../models/resa.js');

const isReserved = (req, res, next) => {
    var user = req.user
    let id = req.originalUrl.split('/')[3]
    resa.getOneResa(id, user.userId, function (result){
      if (result[0] === undefined){
        res.locals.isReserved = 0;
        next()
      }
      else {
        res.locals.isReserved = 1;
        next()
      }
    });
  }

module.exports = isReserved;
