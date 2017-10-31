var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var Startup = require('./models/Startup');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/api', function(req, res) {
    Startup.find(function(err, startups) {
        if (err)
            res.send(err);

        res.json(startups);
    });
});

router.get('/api/:id', function(req, res) {
    Startup.findById(req.params.id, function(err, startups) {
        if (err)
            res.send(err);

        res.json(startups);
    });
});

router.get('/api/search/:query', function(req, res) {
    Startup.search(req.params.query, function(err, startups) {
        if (err)
            res.send(err);

        res.json(startups);
    });
});

router.get('*', function(req, res) {
    res.redirect('/api');
});

app.use('/', router);

app.listen(port);
console.log('Connected on port : ' + port);