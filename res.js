/*==============================================================================*/
/* Casper generated Mon Feb 08 2016 13:46:57 GMT+0100 (CET) */
/*==============================================================================*/

var x = require('casper').selectXPath;
casper.options.viewportSize = {width: 1019, height: 932};
casper.on('page.error', function(msg, trace) {
   this.echo('Error: ' + msg, 'ERROR');
   for(var i=0; i<trace.length; i++) {
       var step = trace[i];
       this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
   }
});
casper.test.begin('Resurrectio test', function(test) {
   casper.start('https://stuart.staffomaticapp.com/');
   casper.waitForSelector("form input[name='user[email]']",
       function success() {
           test.assertExists("form input[name='user[email]']");
           this.click("form input[name='user[email]']");
       },
       function fail() {
           test.assertExists("form input[name='user[email]']");
   });
   casper.waitForSelector("input[name='user[email]']",
       function success() {
           this.sendKeys("input[name='user[email]']", "harry.gueguen@gmail.com");
       },
       function fail() {
           test.assertExists("input[name='user[email]']");
   });
   casper.waitForSelector("input[name='user[password]']",
       function success() {
           this.sendKeys("input[name='user[password]']", "42310102Ss");
       },
       function fail() {
           test.assertExists("input[name='user[password]']");
   });
   casper.wait(1000);
   casper.then(function() {
       this.captureSelector("screenshot1.png", "html");
   });
   casper.waitForSelector("form #login-form button",
       function success() {
           test.assertExists("form #login-form button");
           this.click("form #login-form button");
       },
       function fail() {
           test.assertExists("form #login-form button");
   });
   casper.waitForSelector(x("//a[normalize-space(text())='shorthanded shifts']"),
       function success() {
           test.assertExists(x("//a[normalize-space(text())='shorthanded shifts']"));
           this.click(x("//a[normalize-space(text())='shorthanded shifts']"));
       },
       function fail() {
           test.assertExists(x("//a[normalize-space(text())='shorthanded shifts']"));
   });

   casper.run(function() {test.done();});
});