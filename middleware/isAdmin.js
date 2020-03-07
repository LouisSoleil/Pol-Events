const isAdmin = (req, res, next) => {
    var user = req.user
    if (user.isAdmin > 0){
      next()
    } else {
        return res.status(403).redirect("/")
    }
};

module.exports = isAdmin;
