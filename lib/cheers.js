var request = require("request");
var cheerio = require("cheerio");
var parseEmailData = require("./parseEmailData");
var fs = require("fs");

var getURI = "https://www.tinypulse.com/user_portal/cheers/new?response_token=";
var postURI = "https://www.tinypulse.com/user_portal/cheers?response_token=";

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

var Cheers = {
	sendCheers: function(opts, cb) {
		var url = getURI + opts.token;
		var headers = {
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36"
		};
		request({url:url, headers:headers}, function(err, res, body){
			if(err) {
				cb(err);
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
					if(err) {
						cb(err);
					}
					else if(body.indexOf(opts.token) !== -1) {
						cb(null);
					}
					else {
						cb(new Error("Cheers was unsuccessful. We did not get the expected response."));
					}
				});
			}
		});
	},


	getCheersPage: function(opts, cb) {
		var page = opts.page;
		var type = opts.type;
		var token = opts.token;
		var numResults = opts.numResults ? opts.numResults : "all";
		var resultsPrinted = 0;
		var self = this;
		var cheersURLComponent;
		var cheersURLComponent = type === "received" ? "more" : "more_sent";
		var cheersURL = "https://www.tinypulse.com/user_portal/cheers/" + cheersURLComponent + "?page=" + page + "&response_token=" + token;
		request(cheersURL, function(err, res, body){
			if(err) {
				cb(err);
			}
			else{
				var $ = cheerio.load(body);
				var myCheers = $(".cheer");
				myCheers.each(function(index, cheer){

					var $cheer = cheerio.load($(cheer).html());
					var topText = $cheer(".top-text").text().split("\non");
					var slice = type === "received" ? 5 : 4
					var from = topText[0].slice(slice).trim();
					var dateReceived = topText[1].trim();
					var cheersComment = $cheer("p").text().split("Reported as abusive")[0].trim();
					console.log(from + " - " + dateReceived);
					console.log(cheersComment);
					console.log();
					resultsPrinted += 1;

					if(numResults !== "all" && resultsPrinted === numResults){
						return false;
					}

				})
			}
			if($.html().indexOf('Loading...') > -1 && resultsPrinted < numResults) {
				self.getCheersPage({page: page+1 , type: type, token: token, numResults: numResults})
			}
		})


	}
}

module.exports = Cheers;
