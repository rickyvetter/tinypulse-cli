var request = require("request");
var cheerio = require("cheerio");
var parseEmailData = require("./parseEmailData");
var fs = require("fs");

var getURI = "https://www.tinypulse.com/user_portal/cheers/new?response_token=";
var postURI = "https://www.tinypulse.com/user_portal/cheers?response_token=";
var getCheersReceivedURI = "https://www.tinypulse.com/user_portal/cheers?response_token=";
var getCheersSentURI = "https://www.tinypulse.com/user_portal/cheers/sent?response_token=";
appDirectory = process.env.HOME + "/.cheers";
dataPath = appDirectory + "/data.json";

var autoCompleteEmail = function(email, emailData) {
	var completedEmail;
	if(emailData.emails.indexOf(email) !== -1) {
		completedEmail = emailData.emails[emailData.emails.indexOf(email)];
	}
	else if(emailData.emails.indexOf(email + "@" + emailData.domain) !== -1) {
		completedEmail = emailData.emails[emailData.emails.indexOf(email + "@" + emailData.domain)];
	}
	else {
		throw new Error(email + " is not a valid " + emailData.domain + " email address.");
	}
	return completedEmail;
};

var getFormFields = function(body) {
	var form = {};

	var fields = body("input");
	fields.each(function() {
		form[body(this).attr("name")] = body(this).val();
	});

	var textareas = body("textarea");
	textareas.each(function() {
		form[body(this).attr("name")] = "";
	});
	
	return form;
};

var getEmailData = function(body) {
	var scripts = body("script");
	var script = "";
	scripts.each(function() {
		var text = body(this).text();
		if(text.indexOf(".cheers-autocomplete") != -1) {
			script = text;
		}
	});

	var emailData = parseEmailData(script);

	return emailData;
};

module.exports = Cheers = {
	sendCheers: function(opts) {
		request(getURI + opts.token, function(err, res, body){
			if(err) {
				console.error(err);
			}
			else {
				var cheerioBody = cheerio.load(body);

				var emailData = getEmailData(cheerioBody);
				var email = autoCompleteEmail(opts.email, emailData);

				var form = getFormFields(cheerioBody);
				form["respond[cheers][][receiver_email]"] = email;
				form["respond[cheers][][anonymous]"] = opts.isAnonymous;
				form["respond[cheers][][praise]"] = opts.message;

				request.post({url: postURI + opts.token, form: form}, function (err, res, body) {
					console.log(err, body);
					if(body.indexOf(opts.token) !== -1) {
						console.log("Success!")
					}
				});
			}
		});
	},


	getReceivedCheers: function() {
		fs.readFile(dataPath, function(err, buf) {
		var data = JSON.parse(buf.toString());
			request(getCheersReceivedURI + data.token, function(err, res, body){
				if(err) {
					console.log(err);
				}
				else{
					var $ = cheerio.load(body);
					var receivedCheers = $(".cheer");
					receivedCheers.each(function(index, cheer){
		
						var $cheer = cheerio.load($(cheer).html());
						var topText = $cheer(".top-text").text().split("\non");
						var from = topText[0].slice(5).trim();
						var dateReceived = topText[1].trim();
						var cheersComment = $cheer("p").text().split("Reported as abusive")[0].trim();
						console.log(from + " - " + dateReceived);
						console.log(cheersComment);
						console.log();

					})
				}
			})
		})
	},
	getSentCheers: function() {
		fs.readFile(dataPath, function(err, buf) {
		var data = JSON.parse(buf.toString());
			request(getCheersSentURI + data.token, function(err, res, body){
				if(err) {
					console.log(err);
				}
				else{
					var $ = cheerio.load(body);
					var receivedCheers = $(".cheer");
					receivedCheers.each(function(index, cheer){
		
						var $cheer = cheerio.load($(cheer).html());
						var topText = $cheer(".top-text").text().split("\non");
						var from = topText[0].slice(4).trim();
						var dateSent = topText[1].trim();
	
						var cheersComment = $cheer("p").text().split("Reported as abusive")[0].trim();
						console.log(from + " - " + dateSent);
						console.log(cheersComment);
						console.log();
					})
				}
			})
		})
	}
}

module.exports = Cheers;
