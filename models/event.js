let connect = require('./config.js')

class Event {

  static getType(cb) {
    connect.query('SELECT * FROM typeevent', function(err, rows){
      if (err) throw err
      cb(rows)
    });
  };

  static getAll(cb) {
    connect.query('SELECT * FROM evenement WHERE afficher = ?',[0], function(err, rows){
      if (err) throw err
      cb(rows)
    });
  };

  static getEvent(idE, cb){
    connect.query('SELECT * FROM evenement WHERE idEvent = ?', [idE], function(err, row){
      if (err) throw error
      cb(row)
    })
  }

  static createEvent(type, name, capacity, dateE, dateI, dist, team, show, imgE, cb) {
    connect.query("INSERT INTO evenement SET idTypeE = ?, libelleEvent = ? , nbMaxparticipant = ?, DateEvent = ?, dateFinInscr = ?, distance = ?, parEquipe = ?, afficher = ?, photo = ?", [type, name, capacity, dateE, dateI, dist, team, show, imgE], function(err, result){
      if (err) throw err
      cb(result)
    });
  }

}

module.exports = Event
