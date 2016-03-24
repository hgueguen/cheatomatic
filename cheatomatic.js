// ====		GLOBALS
var DATE = "Mon 8.2."
var	RETRY_TIME = 5000
var	alt = 0

// ====		INITIALISAGE
var casper = require('casper').create({
	verbose: true
});
casper.options.waitTimeout = 10000;
var mouse = require("mouse").create(casper);

// ====		LES FONCTIONS
function	ft_register() {
	//casper.echo("");
	casper.exit();
}

function	check() {
	if ((casper.getPageContent().indexOf(">11</small>") !== -1)) {
		casper.echo("New schedule found", "GREEN_BAR");
		ft_register();
		return ;
	}
	casper.echo("New schedule not found", "WARNING");
	casper.wait(RETRY_TIME).thenClick('a.navbar-brand').thenClick("i.fa.fa-calendar.fa-lg.fa-fw").then(check);
}

// ====		LANCEMENT DES HOSTILITES
casper.start('https://stuart.staffomaticapp.com', function() {
	casper.echo("## Logging", "COMMENT");
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

casper.run(casper.echo("## Opening log page", "COMMENT"));
