var express = require('express')
  , app = express()
  , fs = require('fs');

// load json file
var data = require('./data');

// parse data
app.use(express.bodyParser());

// cors enabling
// http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

// server list of all todos
app.get('/todos', function(req, res) {

  // some 'fancy' no-cache headers
  res.header('Cache-Control', 'no-cache, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', -1);

  // just return the data object as json
  res.json(data);
});

// add new todo
app.put('/todo/:id', function(req, res) {
  
  // add new item
  data.todos.push(req.body);

  // write it to filesystem
  fs.writeFile(__dirname + '/data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
  }); 

  // response back
  res.json(req.body);
});


// start server
app.listen(3000);
console.log('Listening on port 3000');