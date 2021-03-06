let connect = require('./config.js')

class Event {

  static getType(cb) {
    connect.query('SELECT * FROM typeevent', function(err, rows){
      if (err) throw err
      cb(rows)
    });
  }

  static getAll(cb) {
    connect.query('SELECT * FROM evenement', function(err, rows){
      if (err) throw err
      cb(rows)
    });
  }

  static getAllU(cb) {
    connect.query('SELECT * FROM evenement WHERE afficher = ?',[1], function(err, rows){
      if (err) throw err
      cb(rows)
    });
  }

  static getEvent(idE, cb){
    connect.query('SELECT * FROM evenement WHERE idEvent = ?', [idE], function(err, row){
      if (err) throw error
      cb(row)
    });
  }

  static modifyNb(id, capacity, cb) {
    connect.query("UPDATE evenement SET nbMaxParticipant = ? WHERE idEvent = ?", [capacity, id], function(err, result){
      if (err) throw err
      cb(result)
    });
  }

  static createEvent(type, name, capacity, dateE, dateI, show, imgE, cb) {
    connect.query("INSERT INTO evenement SET idTypeE = ?, libelleEvent = ? , nbMaxparticipant = ?, dateEvent = ?, dateFinInscr = ?, afficher = ?, photo = ?", [type, name, capacity, dateE, dateI, show, imgE], function(err, result){
      if (err) throw err
      cb(result)
    });
  }

  static modifyEvent(id, name, capacity, dateE, dateI, etat, cb) {
    connect.query("UPDATE evenement SET libelleEvent = ? , nbMaxparticipant = ?, dateEvent = ?, dateFinInscr = ?, afficher = ? WHERE idEvent = ?", [name, capacity, dateE, dateI, etat, id], function(err, result){
      if (err) throw err
      cb(result)
    });
  }

 static getParticEvent(id, cb) {
   connect.query("SELECT personne.email, personne.nom, personne.prenom, personne.idDep, personne.dateNaissance FROM personne JOIN inscrire ON personne.email = inscrire.email WHERE idEvent = ? ORDER BY idDep", [id], function(err, rows){
     if (err) throw err;
     cb(rows)
   });
 }

 static deleteEvent(id, cb) {
   connect.query("DELETE FROM evenement WHERE idEvent = ?", [id], function(err, result){
     if (err) throw err;
     cb(result)
   })
 }

}

module.exports = Event
