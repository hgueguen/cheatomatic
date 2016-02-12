// ====		LA DATE
var START_DATE = "Mon 15.2"
var	RETRY_TIME = 10000


// ====		INITIALISAGE
var casper = require('casper').create({
	verbose: true,
	logLevel: 'debug'
});
casper.options.waitTimeout = 10000;
var mouse = require("mouse").create(casper);

// ====		LES FONCTIONS
function	ft_register() {
	casper.log("NEW WEEK PUBLISHED, LEGO !", 'info');
	
}

function	ft_retry_later() {
	casper.log("New week is not published yet. Ten seconds before retry", 'info');
	casper.click('a.navbar-brand');
	casper.wait(RETRY_TIME);
	casper.waitForSelector('i.fa.fa-calendar.fa-lg.fa-fw', function() {
		casper.click("i.fa.fa-calendar.fa-lg.fa-fw");
		casper.waitForText(START_DATE, ft_register(), ft_retry_later());
	});
}

// ====		LANCEMENT DES HOSTILITES
casper.start('https://stuart.staffomaticapp.com', function() {
	casper.waitForSelector('button.btn.btn-default', function() {
		casper.sendKeys("input[name='user[email]']", "harry.gueguen@gmail.com");
		casper.sendKeys("input[name='user[password]']", "42310102Ss");
		casper.click("#login-form button");
		casper.waitForSelector('i.fa.fa-calendar.fa-lg.fa-fw', function() {
			casper.click("i.fa.fa-calendar.fa-lg.fa-fw");
			casper.waitForText(START_DATE, ft_register(), ft_retry_later());
		});
	});
});

casper.run();
