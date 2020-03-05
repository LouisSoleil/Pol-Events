let jwt = require('jsonwebtoken')

const JWT_SIGN_SECRET = '19ljbiPiàji097gytr'

const isConnected = (req, res, next) => {
    const cookie = req.cookies['jwt'];
    if (cookie != undefined) {
        var token_decoded = jwt.verify(cookie, JWT_SIGN_SECRET)
        req.user = token_decoded;
        next();
    }
    else {
      return res.redirect("/");
    }
};

module.exports = isConnected;
