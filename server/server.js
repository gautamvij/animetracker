const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const ejs = require('ejs');

app.use(express.static(__dirname  + '/../src'));
app.use(bodyParser.json());
app.set('views', __dirname + '/../');
app.engine('html', ejs.renderFile);


require('./routes')(app);

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('JustAnime is listening at http://%s:%s', host, port);
  });


