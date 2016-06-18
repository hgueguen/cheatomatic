// ====		GLOBALS
var url = "https://junesand.staffomaticapp.com"
var login = "harry.jmg@gmail.com"
var passw = "42310102S"

// var url = "https://stuart.staffomaticapp.com"
// var login = "harry.gueguen@gmail.com"
// var passw = "42310102Ss"

var return_val
var weeknum = 25
var NAME_DEPARTMENT = "8ème arrondissement"
var NAME_DEPARTMENT1 = "17ème arrondissement"
var departments = [NAME_DEPARTMENT, NAME_DEPARTMENT1]
var dept_num = 0
var	RETRY_TIME = 5000
var WAIT_MAX = 5000
var page_string
var page_array
var array_len
var span = "span."
var hrefbegin = "a#schedule-"
var hrefend = ".panel.panel-default"
var lun_wishes = ["8:00 - 11:30"]
var mar_wishes = ["8:00 - 11:30"]
var mer_wishes = ["8:00 - 11:30"]
var jeu_wishes = ["8:00 - 11:30"]
var ven_wishes = ["8:00 - 11:30"]
var sam_wishes = ["8:00 - 11:30"]
var dim_wishes = ["8:00 - 11:30"]
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
function		get_elements_code(dept_no) {
	var			element_list = [];

	page_string = casper.getPageContent();
	page_array = page_string.split('ccc-category-color');
	for (var i = 0; i < page_array.length; i++)
	{
		if (page_array[i].indexOf(departments[dept_no]) !== -1 && page_array[i].indexOf("08:00") !== -1 )
			break ;
	}
	var days_array = page_array[i].split('col-sm-day');
	days_array.shift();
	var x = 0;
	while (x < days_array.length)
	{
		var dayshift_array = days_array[x].split("<a");
		dayshift_array.shift();
		var i = 0;
		while (i < wishes[x].length)
		{
			var firstindex = dayshift_array.findIndex(function (str) {
				if (str.indexOf(wishes[x][i]) !== -1)
					return (1);
				return (0);
			});
			if (firstindex !== -1)
			{
				var raw_id = dayshift_array[firstindex].substr(dayshift_array[firstindex].search("events-container"));
				var clean_id = raw_id.substr(0, raw_id.search(">") - 1);
				var cleaner_id = clean_id.replace(/ /g, ".");
				var final_id = span.concat(cleaner_id);
				element_list.push(final_id);
			}
			i++;
		}
		x++;
	}
	return (element_list);
}

//*[@id="opentip-19"]/div/div[2]/div/p/small

function		take_that_shift(todo_lists, n_shift, n_dept, taken) {
	if (n_dept == todo_lists.length)
	{
		//casper.echo("B");
		return_val = 0;
		return ;
	}
	casper.wait(500, function () {
		casper.waitForSelector(todo_lists[n_dept][n_shift], function () {
			casper.evaluate(function(the_selector) {
				$(the_selector).trigger("mouseenter");
			}, todo_lists[n_dept][n_shift]);
			var z_sp = casper.getPageContent().split('opentip');
			var z_st = z_sp[3].indexOf("danger") + 8;
			var z_en = z_sp[3].indexOf("</span>");
			var taken_places = parseInt(z_sp[3].slice(z_st, z_st + 2));
			var total_places = parseInt(z_sp[3].slice(z_en - 2, z_en));
			if (taken_places < total_places) {
				casper.click(todo_lists[n_dept][n_shift]);
				casper.waitFor(function check() {
					if (casper.exists("button.btn.btn-default.action-assign"))
						return (1);
					if (casper.exists("button.btn.btn-default.action-apply"))
						return (1);
					if (casper.exists("button.btn.btn-default.action-remove"))
						return (1);
					if (casper.getPageContent.indexOf("You are assigned to this shift") !== -1)
						return (1);
					return (0);
				}, function then() {
					if (casper.exists("button.btn.btn-default.action-assign")) {
						casper.click("button.btn.btn-default.action-assign");
						casper.echo("Shift (" + n_shift + ") in "  + departments[n_dept] + " : Ok", "PARAMETER");
						casper.waitForSelector("button.close", function () {
							casper.wait(500, function() {
								casper.click("button.close");
								return_val = 1;
								return ;
							});
						});
					}
					else {
						casper.echo("Shift (" + n_shift + ") in "  + departments[n_dept] + " : Nope (assign missing)", "PARAMETER");
						casper.waitForSelector("button.close", function () {
							casper.wait(500, function() {
								casper.click("button.close");
								return_val = 0;
								take_that_shift(todo_lists, n_shift, n_dept + 1);
								return ;
							});
						});
					}
				}, function onTimeOut() {
					casper.echo("Shift (" + n_shift + ") in "  + departments[n_dept] + " : Nope (timeout)", "PARAMETER");
					casper.waitForSelector("button.close", function () {
						casper.click("button.close");
						return_val = 0;
						take_that_shift(todo_lists, n_shift, n_dept + 1);
						return ;
					});
				}, 2000);
			} else {
				casper.echo("Shift (" + n_shift + ") in "  + departments[n_dept] + " : Nope (full)", "PARAMETER");
				return_val = 0;
				take_that_shift(todo_lists, n_shift, n_dept + 1);
				return ;
			}
			
		});	
	});
}

function		take_them_all(todo_lists, n_shift) {
	var			return_val;

	if (n_shift == todo_lists[0].length)
		return ;
	//casper.echo("A");
	take_that_shift(todo_lists, n_shift, 0, 0);
	casper.waitFor(function check() {
		if (return_val !== 'undefined')
			return (1);
		return (0);
	}, function then() {
		if (return_val == 1)
			casper.echo("## # Success", "TRACE");
		else if (return_val == 0)
			casper.echo("## # Fail", "WARNING");
		return_val = 'undefined';
		return (take_them_all(todo_lists, n_shift + 1));
	});
}

function		register_page_actions() {
	// Pour chaque arrondissement, recup la liste des shifts voulus
	// Pour chaque shift different, essayer inscription dans chaque arrondissement (1 ou 0)
	// -> Quand 1 : Passer au shift suivant et afficher Success
	// -> Quand 0 : Passer à l'arrondissement suivant
	// -> Quand plus d'arrondissement : Passer au shift suivant et afficher Fail
	// -> Quand plus de shifts : Terminé, gg wp
	casper.echo("## Register page actions", "TRACE");
	var			i, j, last_j, ret;
	var			todo_lists = new Array(departments.length);

	i = 0;
	while (i < departments.length) {
		todo_lists[i] = [];
		todo_lists[i] = get_elements_code(i);
		i++;
	}
	take_them_all(todo_lists, 0);
}

function		go_to_register_page() {
	casper.echo("## Going to register page", "TRACE");
	var			page_string;
	var			page_splitted;
	var			good_part_index;
	var			start_index;
	var			end_index;
	var			event_str;
	page_string = casper.getPageContent();
	page_splitted = page_string.split('schedule-item-container');
	good_part_index = page_splitted.findIndex(function (str) {
		if (str.indexOf(weeknum + "</small>") !== -1)
			return (1);
		return (0);
	});
	start_index = page_splitted[good_part_index].search("data-event-parent-id=");
	end_index = page_splitted[good_part_index].search(" data-event-ids");
	event_str = page_splitted[good_part_index].substring(start_index, end_index);
	event_str = event_str.substr(event_str.search("=") + 2);
	event_str = event_str.substr(0, event_str.length - 1);
	event_str = hrefbegin.concat(event_str);
	event_str = event_str.concat(hrefend);
	casper.click(event_str);
	casper.waitFor(function() {
		if (casper.getPageContent().split('ccc-category-color').some(function (str) {
			if (str.indexOf(departments[dept_num]) !== -1 && str.indexOf("8:00") !== -1)
				return (1);
			return (0);
		}))
			return (1);
		return (0);
	}, function () {
		register_page_actions();
	});
}

function		is_new_week_found() {
	if ((casper.getPageContent().indexOf(weeknum + "</small>") !== -1))
		return (1);
	return (0);
}

function		check() {
	casper.echo("## Checking...", "PARAMETER");
	if (is_new_week_found())
		return (go_to_register_page());
	casper.reload(function() {
		casper.wait(RETRY_TIME).then(check);
	});
}

// ====		LANCEMENT DES HOSTILITES
casper.start(url, function() {
	casper.waitForSelector('button.btn.btn-default', function() {
		casper.echo("## Page opened, logging...", "TRACE");
		casper.sendKeys("input[name='user[email]']", login);
		casper.sendKeys("input[name='user[password]']", passw);
		casper.click("#login-form button");
		casper.waitForSelector("img.img-rounded.media-object", function () {
			casper.click("img.img-rounded.media-object");
			casper.waitForSelector('div.schedule-item-container', function () {
				return check();
			}, function () {
				casper.echo("ONE");
				casper.echo(casper.getPageContent());
			});
		}, function () {
			casper.echo("TWO");
			casper.echo(casper.getPageContent());
		});
	});
});

casper.run(casper.echo("## Opening log page", "COMMENT"));
