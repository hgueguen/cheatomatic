// ====		GLOBALS
var DATE = "Mon 8.2."
var	RETRY_TIME = 10000


// ====		INITIALISAGE
var casper = require('casper').create({
	verbose: true,
	//logLevel: 'info'
});
casper.options.waitTimeout = 10000;
var mouse = require("mouse").create(casper);

// ====		LES FONCTIONS
function	ft_register() {
	casper.exit();
}

function	check() {
	//casper.debugHTML();
	if (casper.getPageContent().indexOf("15.-21. Feb") !== -1) {
		console.log("BANZAIII");
		casper.log("DATE MOTHAFUCKIN FOUNDED");
		ft_register();
	} else {
		console.log("nope");
		casper.log("Nope. Ten seconds before retry", 'info');
		casper.wait(RETRY_TIME).thenClick('a.navbar-brand').thenClick("i.fa.fa-calendar.fa-lg.fa-fw").then(check);
		casper.wait(500);
	}
}

// ====		LANCEMENT DES HOSTILITES
casper.start('https://stuart.staffomaticapp.com', function() {
	casper.waitForSelector('button.btn.btn-default', function() {
		casper.sendKeys("input[name='user[email]']", "harry.gueguen@gmail.com");
		casper.sendKeys("input[name='user[password]']", "42310102Ss");
		casper.click("#login-form button");
		casper.waitForSelector('i.fa.fa-calendar.fa-lg.fa-fw', function() {
			casper.click("i.fa.fa-calendar.fa-lg.fa-fw");
			casper.waitForSelector('div.schedule-item-container.active').then(check);
		});
	});
});

casper.run();
