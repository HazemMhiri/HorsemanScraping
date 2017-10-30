var Horseman = require('node-horseman');
var horseman = new Horseman();

var Startup = require('./model');

var startups = [];

function getStartups() {
    return horseman.evaluate(function() {
        console.log('[Info] Going through page startups...');

        var startupSelector = "#bloc_results_list > .listing > .item";
        var startups = [];

        $(startupSelector).each(function(item) {
            var startup = {
                name: $(this).children(".wrapper > h3").text(),
                logo: $(this).children(".image > a > .startuplogo_bloc1 > img").attr("src"),
                description: $(this).children(".image > a > .overlay > p").text(),
                activity: $(this).children(".wrapper > .info > .type:first").text(),
                address: $(this).children(".wrapper > figure").text()
            };

            console.log('[Info] Adding new startup to the list...');
            startups.push(startup);
        });

        return startups;
    });
}

function hasNextPage() {
    return horseman.exists(".pagination .next:not(.hidden)");
}

function scrape() {

    return new Promise(function(resolve, reject) {
        return getStartups()
            .then(function(newStartups) {

                startups = startups.concat(newStartups);

                return hasNextPage()
                    .then(function(hasNext) {
                        if (hasNext) {
                            return horseman
                                .click(".pagination .next")
                                .wait(10000)
                                .then(scrape);
                        }
                    });
            })
            .then(resolve);
    });
}

horseman
    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .open('http://www.disruptunisia.com/annuaire-startup-tunisie')
    .waitForSelector('#bloc_results_grid', { timeout: 15000 })
    .then(scrape)
    .finally(function() {
        console.log("[Success] Scraping done! Found " + startups.length + " Startups in Disruptunisia's website.");

        Startup.insertMany(startups)
            .then(function(docs) {
                console.log("[Success] Bulk insertion into mongoDB database done! " + docs.length + " insertions.");
            })
            .catch(function(err) {
                console.log("[Error] Insertions failed... " + err);
            });

        horseman.close();
    });