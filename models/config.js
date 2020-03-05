let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'polevent'
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
