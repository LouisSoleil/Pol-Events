let jwt = require('jsonwebtoken')

const JWT_SIGN_SECRET = '19ljbiPiàji097gytr'

const isConnected = (req, res, next) => {
    const cookie = req.cookies['jwt'];
    if (cookie != undefined) {
        var token_decoded = jwt.verify(cookie, JWT_SIGN_SECRET)
        res.locals.estConnecte = 1;
        req.user = token_decoded;
        if (token_decoded.isAdmin == 1){
          res.locals.isAdmin=1
        }
        next();
    }
    else {
      return res.redirect("/users");
    }
};

module.exports = isConnected;
