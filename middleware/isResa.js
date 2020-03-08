const isResa = (req, res, next) => {
    let id = req.originalUrl.split('/')[1]
    if (id === 'resa'){
        res.locals.isResa = 1;
        next()
      }
      else {
        res.locals.isResa = 0;
        next()
      }
    }
module.exports = isResa;
