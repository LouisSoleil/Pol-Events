const isAdmin = (req, res, next) => {
    var user = req.user
    if (user.isAdmin == 1){
      next()
    } else {
        return res.status(403).redirect("/")
    }
};

module.exports = isAdmin;
