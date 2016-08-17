var express = require('express');
var app = express();
var path = require('path');

app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);
app.get('/', function (req, res) {
    res.render('index.html');
  });

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('JustAnime is listening at http://%s:%s', host, port);
  });
