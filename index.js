var fs = require('fs');
var minimist = require("minimist");
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require("mkdirp");

var argObject = minimist(process.argv.slice(2));
var argList = argObject._;
var email = argObject.email || argObject.e || argList[0];
var message = argObject.message || argObject.m || argList.slice(1).join(" ");
var isAnnonymous = argObject.annonymous ? 1 : 0 || argObject.a ? 1 : 0;

var getURI = "https://www.tinypulse.com/user_portal/cheers/new?response_token=";
var postURI = "https://www.tinypulse.com/user_portal/cheers?response_token=";
var appDirectory = process.env.HOME + "/.cheers";
var dataPath = appDirectory + "/data.json";

var getFormFields = function(body) {
	var $ = cheerio.load(body);
	var form = {};

	var fields = $("input");
	fields.each(function() {
		form[$(this).attr("name")] = $(this).val();
	});

	var textareas = $("textarea");
	textareas.each(function() {
		form[$(this).attr("name")] = message;
	});

	form["respond[cheers][][receiver_email]"] = email;
	form["respond[cheers][][anonymous]"] = isAnnonymous;
	form["respond[cheers][][praise]"] = message;
	
	console.log(form);
	return form;
};

var sendCheers = function(token) {
	request(getURI + token, function(err, res, body){
		if(err) {
			console.error(err);
		}
		else {
			var form = getFormFields(body);

			request.post({url: postURI + token, form: form}, function (err, res, body) {
				console.log(err, body);
				if(body.indexOf(token) !== -1) {
					console.log("Success!")
				}
			});
		}
	});
};

if(argObject.token) {
	var data = {
		token: argObject.token
	};

	mkdirp.sync(appDirectory);
	fs.writeFile(dataPath, JSON.stringify(data), function(err) {
		if (err) {
			console.error(err);
		}
		else {
			console.log("Token added:", data.token);
		}
	});
}
else {
	fs.readFile(dataPath, function(err, buf) {
		var data = JSON.parse(buf.toString());

		sendCheers(data.token);
	});
}


