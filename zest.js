var casper = require('casper').create();

var casperContext = "phantom";

casper.start.then.casper.evaluate(function(pageDomContext) {
    casper.log("will echo ->phantom<- in the page DOM environment : " + pageDomContext + ", use casper.on('remote.message') to see it in the console");
}, casperContext);