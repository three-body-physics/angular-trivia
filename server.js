var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var port = process.env.PORT || 5000;
var router = express.Router();

var app = express();

app.use(serveStatic(__dirname + "/dist"));
app.use(router);

router.get('/*', function (req, res) {  
     return res.sendFile(path.join(__dirname, '/dist', 'index.html'));
});

app.listen(port);