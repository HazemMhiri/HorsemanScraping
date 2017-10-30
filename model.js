var mongoose = require('mongoose');
var db = mongoose.connect("mongodb://scraper:scraper2017@ds139585.mlab.com:39585/startups_tn");

var schema = mongoose.Schema({ 
	name: 'string',
	logo: 'string',
	description: 'string',
	activity: 'string',
	address: 'string',
});

var Startup = db.model('Startup', schema);

module.exports = Startup;