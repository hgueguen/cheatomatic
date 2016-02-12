var casper = require('casper').create({
	//verbose: true,
	logLevel: 'debug'
})
var mouse = require("mouse").create(casper);

casper.start('https://stuart.staffomaticapp.com');

casper.then(function() {
	casper.waitForSelector('button.btn.btn-default', function() {
		casper.sendKeys("input[name='user[email]']", "harry.gueguen@gmail.com");
		casper.sendKeys("input[name='user[password]']", "42310102Ss");
		casper.click("#login-form button");
		casper.waitForSelector('i.fa.fa-calendar.fa-lg.fa-fw', function() {
			casper.click("i.fa.fa-calendar.fa-lg.fa-fw");
			casper.waitForSelector('div.schedule-item-container.active', function() {
				//casper.debugHTML();
			});
		});
	});
});

casper.run();
