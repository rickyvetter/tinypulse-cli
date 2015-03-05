#! /usr/bin/env node
var fs = require("fs");
var minimist = require("minimist");
var cheers = require("./cheers");
var token = require("./token");

var argObject = minimist(process.argv.slice(2));
var argList = argObject._;
var email = argObject.email || argObject.e || argList[0];
var message = argObject.message || argObject.m || argList.slice(1).join(" ");
var isAnonymous = argObject.anonymous ? 1 : 0 || argObject.a ? 1 : 0;


if(argObject.token) {
	token.update(argObject.token);
} 
else if(argObject.email && argObject.password){
	token.addFromEmail(argObject.email, argObject.password);
}
else if(argObject.received) {

	fs.readFile(token.dataPath, function(err, buf) {
		var numResults = argObject.received === true ? "all" : argObject.received
		var data = JSON.parse(buf.toString());
		cheers.getCheersPage({page: 1, type: "received", token: data.token, numResults: numResults});
	});
}
else if(argObject.sent) {
	fs.readFile(token.dataPath, function(err, buf) {
		var numResults = argObject.sent === true ? "all" : argObject.sent
		var data = JSON.parse(buf.toString());
		cheers.getCheersPage({page: 1, type: "sent", token: data.token, numResults: numResults});
	});
}
else {
	fs.readFile(token.dataPath, function(err, buf) {
		var data = JSON.parse(buf.toString());
		cheers.sendCheers({
			token: data.token,
			email: email,
			message: message,
			isAnonymous: isAnonymous
		});
	});
}