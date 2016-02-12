var casper = require('casper').create({
	verbose: true,
	logLevel: 'debug'
})
var mouse = require("mouse").create(casper);

casper.start('https://stuart.staffomaticapp.com');

casper.then(function() {
	casper.log("-> Start", 'info');
		this.sendKeys("input[name='user[email]']", "harry.gueguen@gmail.com");
		this.sendKeys("input[name='user[password]']", "42310102Ss");
		this.click("#login-form button");
    	console.log("-> Logging in");
    	casper.waitForText("Welcome to your location overview", function() {
    		//this.debugHTML();
    		console.log("-> We suppose to be logged");
    		//casper.wait(5000, function() {
    			this.click("i.fa.fa-calendar.fa-lg.fa-fw");
				//this.mouse.click("#locations/16381/schedules");
				console.log("-> We make it to schedules");
    		//});
    	})
	//});
    
	
   //	wait(2000);
	//this.debugPage();
    
    //this.mouse.click("#locations");
	//console.log("We here");
});

casper.run();
