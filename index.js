#! /usr/bin/env node
var fs = require("fs");
var minimist = require("minimist");
var sendCheers = require("./cheers");
var token = require("./token");

var argObject = minimist(process.argv.slice(2));
var argList = argObject._;
var email = argObject.email || argList[0];
var message = argObject.message || argObject.m || argList.slice(1).join(" ");
var isAnonymous = argObject.anonymous ? 1 : 0 || argObject.a ? 1 : 0;

 appDirectory = process.env.HOME + "/.cheers";
 dataPath = appDirectory + "/data.json";

if(argObject.token) {
	token.update(argObject.token);
} 
else if(argObject.email && argObject.password){
	token.addFromEmail(argObject.email, argObject.password);
}
else {
	fs.readFile(dataPath, function(err, buf) {
		var data = JSON.parse(buf.toString());
		sendCheers({
			token: data.token,
			email: email,
			message: message,
			isAnonymous: isAnonymous
		});
	});
}