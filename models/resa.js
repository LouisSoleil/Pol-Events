let connect = require('./config.js')

class Resa {

  static getResaU(mail, cb) {
    connect.query('SELECT * FROM inscrire WHERE email = ?', [mail], function(err, rows){
      if (err) throw err
      cb(rows)
    });
  };

  static getResaEvent(mail, cb) {
    connect.query('SELECT * FROM evenement JOIN inscrire ON evenement.idEvent = inscrire.idEvent WHERE inscrire.email = ?', [mail], function(err, rows){
      if (err) throw err
      cb(rows)
    });
  };

  static getOneResa(id, mail, cb) {
    connect.query('SELECT * FROM inscrire WHERE email = ? AND idEvent = ?', [mail, id], function(err, result){
      if (err) throw err
      cb(result)
    });
  };

  static addResa(id, mail, cb) {
    connect.query('INSERT INTO inscrire SET email = ?, idEvent = ?', [mail, id], function(err, result){
      if (err) throw err
      cb(result)
    });
  };

  static deleteResa(id, cb) {
    connect.query('DELETE FROM inscrire WHERE idEvent = ?', [id], function(err, result){
      if (err) throw err
      cb(result)
    });
  };

}

module.exports = Resa;
