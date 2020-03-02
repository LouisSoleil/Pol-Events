let connect = require('./config.js')

class Event {

  static getType(cb) {
    connect.query('SELECT * FROM typeevent', function(err, rows){
      if (err) throw err
      cb(rows)
    });
  };

  static createEvent(type, name, capacity, dateE, dateI, dist, team, show, cb) {
    connect.query("INSERT INTO evenement SET idTypeE = ?, LibelleEvent = ? , nbMaxparticipant = ?, DateEvent = ?, dateFinInscr = ?, distance = ?, parEquipe = ?, Afficher = ?", [type, name, capacity, dateE, dateI, dist, team, show], function(err, result){
      if (err) throw err
      cb(result)
    });
  }

}

module.exports = Event
