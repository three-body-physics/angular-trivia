// var express = require("express");
// var app = express();
//
// var path = require("path");
// var bodyParser = require("body-parser");
//
//
// app.use(bodyParser.urlencoded({
//   extended: false
// }));
//
// app.use(bodyParser.json())
//
//
// // app.set("views", path.join(__dirname, "backend", "views"))
//
//
// app.use(express.static(__dirname + '/dist'));
//
// var routes = require("./backend/routes/router");
// app.use("/", routes);
//
// var server = require('http').Server(app).listen(3000, "localhost");

// const express = require('express');
// const app = express();
// const port = process.env.PORT || 8080;
// const router = express.Router();
// var path = require("path");

// app.use(express.static("./dist"));
// app.set('view engine', 'ejs');

// // app.engine(".html", require("ejs").renderFile);

// app.set("views", path.join(__dirname, "dist"))

// router.get('/home', (req, res, next) => {
//   res.render("index"); 
// });

// app.use('*', router);

// app.listen(port);


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