let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : 'eu-cdbr-west-02.cleardb.net',
  user     : 'be83953ced3eb9',
  password : '5a2985c4',
  database : 'heroku_dca756dd59c7a3f'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
/*
connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();

module.exports = config
*/
