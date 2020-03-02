let connect = require('./config')


class User {

  static register (mail, mdp2, lastname, firstname, birth, departmt, cb){
    connect.query("INSERT INTO personne SET email = ?, mdp = ? , nom = ?, prenom = ?, dateNaissance = ?, isAdmin = ?, idDep = ?", [mail, mdp2, lastname, firstname, birth, 0, departmt], function(err, result){
      if (err) throw err
      cb(result)
    });
  }
  static signin(mail, mdp, cb){
    connect.query("SELECT * FROM personne WHERE email = ? AND mdp = ?", [mail, mdp], function(err, rows){
      if (err) throw err
      cb(rows)
    });
  }
  static findOne(mail, cb){
    connect.query("SELECT * FROM personne WHERE email = ? ", [mail], function(err, result){
      if (err) throw err
      cb(result)
    });
  }

  static getDep(cb){
    connect.query('SELECT idDep FROM departement', function(err, rows){
      if (err) throw err
      cb(rows)
    });
  }

  static isAdmin(mail, cb){
    connect.query('SELECT isAdmin FROM personne WHERE email = ?', [mail], function(err, result){
      if (err) throw err
      cb(result)
    });
  }
}
module.exports = User
