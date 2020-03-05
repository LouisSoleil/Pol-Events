let jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '19ljbiPiàji097gytr'

// Exported function
module.exports = {
    generateTokenForUser: function (data) {
      return jwt.sign({
          userId: data.email,
          isAdmin: data.isAdmin
          },
          JWT_SIGN_SECRET
      )
    },
    parseAuthorization: function(authorization){
      return (authorization != null) ? authorization.replace('Bearer ', '') : null
    },
    getUserId: function (req, res) {
      var userId = -1
      const cookie = req.headers.cookie
      if (cookie) {
          var token = cookie.split(".")[1]
          token = module.exports.parseAuthorization((token))
          if (token != null) {
              try {
                  var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                  if (jwtToken != null){
                      userId = jwtToken.userId
                      return userId;
                  }
              } catch (err) {}
          }
      } else {
          return res.status(400).render("users", {error : undefined})
      }
    }
}
