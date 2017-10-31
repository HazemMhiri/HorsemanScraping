var mongoose = require('mongoose');
mongoose.plugin(require('mongoose-regex-search'));

var db = mongoose.connect("mongodb://scraper:scraper2017@ds139585.mlab.com:39585/startups_tn");

var schema = mongoose.Schema({
    name: {
        type: String,
        searchable: true
    },
    logo: {
        type: String,
        searchable: false
    },
    description: {
        type: String,
        searchable: true
    },
    activity: {
        type: String,
        searchable: true
    },
    address: {
        type: String,
        searchable: true
    },
});

var Startup = db.model('Startup', schema);

module.exports = Startup;