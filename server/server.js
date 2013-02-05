var express = require('express')
  , app = express();

// load json file
var data = require('./data');

// server list of all todos
app.get('/todos', function(req, res) {

  // some 'fancy' no-cache headers
  res.header('Cache-Control', 'no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', -1);

  // just return the data object as json or jsonp
  res.jsonp(data);
});


// start server
app.listen(3000);
console.log('Listening on port 3000');