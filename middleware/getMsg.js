const getMsg = (req, res, next) => {
  console.log(req.cookies['Success']);
    if (req.cookies['Success'] != undefined){
      res.locals.getSuccess = req.cookies['Success'];
      next()
    }
    else {
      res.locals.getSuccess = 0;
      next()
    }
}
module.exports = getMsg;
