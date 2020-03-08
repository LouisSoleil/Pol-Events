let connect = require('./config')


class User {

  static register (mail, mdp2, lastname, firstname, birth, departmt, cb){
    connect.query("INSERT INTO personne SET email = ?, mdp = ? , nom = ?, prenom = ?, dateNaissance = ?, isAdmin = ?, idDep = ?", [mail, mdp2, lastname, firstname, birth, 0, departmt], function(err, result){
      if (err) throw err
      cb(result)
    });
  }

  static getAll(cb){
    connect.query("SELECT * FROM personne ORDER BY nom", function(err, rows){
      if (err) throw err
      cb(rows)
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
    connect.query('SELECT idDep FROM departement ORDER BY idDep', function(err, rows){
      if (err) throw err
      cb(rows)
    });
  }

  static modifyProfil(mail, lastname, firstname, birth, psw, dep, cb){
    connect.query("UPDATE personne SET mdp = ?, nom = ?, prenom = ?, dateNaissance = ?, idDep = ? WHERE email = ?", [psw, lastname, firstname, birth, dep, mail], function(err, result){
      if (err) throw err
      cb(result)
    });
  }

  static updateAdmin(mail, etat, cb){
    connect.query("UPDATE personne SET isAdmin = ? WHERE email = ?", [etat, mail], function(err, result){
      if (err) throw err
      cb(result)
    });
  }
}
module.exports = User
