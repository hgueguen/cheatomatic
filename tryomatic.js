// ====		GLOBALS
var url = "https://trying-world.staffomaticapp.com"
var login = "harryfaitdestrucs@gmail.com"
var passw = "42310102S"
var weeknum = 14
var NAME_DEPARTMENT = "glandouille"
var	RETRY_TIME = 5000
var WAIT_MAX = 500
var page_string
var page_array
var array_len
var span = "span."
var hrefbegin = "a#schedule-"
var hrefend = ".panel.panel-default"
var lun_wishes = ["8:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"]
var mar_wishes = ["8:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"]
var mer_wishes = ["8:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"]
var jeu_wishes = ["8:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"]
var ven_wishes = ["8:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"]
var sam_wishes = ["8:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"]
var dim_wishes = ["8:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"]
var wishes = [lun_wishes, mar_wishes, mer_wishes, jeu_wishes, ven_wishes, sam_wishes, dim_wishes]
var to_do_list = []

// ====		INITIALISAGE
var casper = require('casper').create({
	verbose: true
});
casper.options.waitTimeout = 10000;
casper.options.viewportSize = {width: 1600, height: 950};
var mouse = require("mouse").create(casper);

// ====		LES FONCTIONS
function	ft_register_core(list, i) {
	if (i == list.length)
		return ;
	//casper.echo(i);
	casper.waitForSelector(list[i], function () {
		casper.click(list[i]);
		casper.waitForSelector("button.btn.btn-default.action-assign", function () {
			casper.click("button.btn.btn-default.action-assign");
			casper.echo(i + " Clicked");
			casper.waitForSelector("button.close", function () {
				casper.click("button.close");
				casper.echo(i + "Closed");
				ft_register_core(list, i + 1);
			}, function () {
				casper.echo(i + "Timeout for close");
				ft_register_core(list, i + 1);
			}, WAIT_MAX);
		}, function () {
			casper.echo(i + "Timeout for assign");
			casper.waitForSelector("button.close", function () {
				casper.click("button.close");
				casper.echo(i + "Closed");
				ft_register_core(list, i + 1);
			}, function () {
				casper.echo(i + "Timeout for close");
				ft_register_core(list, i + 1);
			}, WAIT_MAX);
		}, WAIT_MAX);
	}, function() {
		casper.echo(i + "Timeout for selector");
		ft_register_core(list, i + 1);
	}, WAIT_MAX);
}

function	ft_register() {
	casper.wait(1000, function() {
		//casper.click("span.events-container.event-parent-id-8187511.event-parent-type-Shift.label.label-danger.hidden");
		
		page_string = casper.getPageContent();
		// Page complete
		page_array = page_string.split('ccc-category-color');
		// Bloc departement avec toute les horaires pour tous les jours
		for (var i = 0; i < page_array.length; i++)
		{
			if (page_array[i].indexOf(NAME_DEPARTMENT) !== -1 && page_array[i].indexOf("08:00") !== -1 )
				break ;
		}
		
		var days_array = page_array[i].split('col-sm-day');
		days_array.shift();
		// Les jours entiers du département recherché

		var x = 0;
		while (x < days_array.length)
		{
			var dayshift_array = days_array[x].split("<a");
			dayshift_array.shift();
			// Les shifts du lundi dans le departement recherché
			var i = 0;
			while (i < wishes[x].length)
			{
				var firstindex = dayshift_array.findIndex(function (str) {
					if (str.indexOf(wishes[x][i]) !== -1)
						return (1);
					return (0);
				});
				// On a l'index de celui ou ya un 8h
				if (firstindex !== -1)
				{
					var raw_id = dayshift_array[firstindex].substr(dayshift_array[firstindex].search("events-container"));
					var clean_id = raw_id.substr(0, raw_id.search(">") - 1);
					var cleaner_id = clean_id.replace(/ /g, ".");
					var final_id = span.concat(cleaner_id);
					to_do_list.splice(0, 0, final_id);
				}
				i++;
			}
			x++;
		}
		casper.echo("## List of " + to_do_list.length + " shifts ready to be checked", "COMMENT");
		//ft_register_core(to_do_list, 0);



	}, function() {
		casper.echo("NOPE");
		casper.debugHTML();
	});
}

function	check() {
	if ((casper.getPageContent().indexOf(weeknum + "</small>") !== -1)) {
		casper.echo("New schedule found", "GREEN_BAR");
		page_string = casper.getPageContent();
		var page_splitted = page_string.split('schedule-item-container');
		var good_part_index = page_splitted.findIndex(function (str) {
			if (str.indexOf(weeknum + "</small>") !== -1)
				return (1);
			return (0);
		});
		//casper.echo(page_splitted[good_part_index]);
		var start_index = page_splitted[good_part_index].search("data-event-parent-id=");
		var end_index = page_splitted[good_part_index].search(" data-event-ids");
		var event_str = page_splitted[good_part_index].substring(start_index, end_index);
		event_str = event_str.substr(event_str.search("=") + 2);
		event_str = event_str.substr(0, event_str.length - 1);
		event_str = hrefbegin.concat(event_str);
		event_str = event_str.concat(hrefend);
		casper.click(event_str);
		ft_register();
		//casper.wait(RETRY_TIME);
		return ;
	}
	casper.echo("New schedule not found", "WARNING");
	casper.waitForSelector('a.navbar-brand', function () {
		casper.click('a.navbar-brand');
		casper.wait(1000, function() {
			casper.waitForSelector("img.img-rounded.media-object", function () {
				casper.click("img.img-rounded.media-object");
				casper.wait(RETRY_TIME).then(check);
			})
		})
		
	})
}

// ====		LANCEMENT DES HOSTILITES
casper.start(url, function() {
	casper.echo("## Logging", "COMMENT");
	casper.waitForSelector('button.btn.btn-default', function() {
		casper.sendKeys("input[name='user[email]']", login);
		casper.sendKeys("input[name='user[password]']", passw);
		casper.click("#login-form button");
		casper.waitForSelector("img.img-rounded.media-object", function () {
			casper.click("img.img-rounded.media-object");
			casper.wait(1000).then(check);
		});
	});
});

casper.run(casper.echo("## Opening log page", "COMMENT"));
