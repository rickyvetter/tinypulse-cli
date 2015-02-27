var fs = require("fs");
var minimist = require("minimist");
var sendCheers = require("./cheers");
var token = require("./token");

var argObject = minimist(process.argv.slice(2));
var argList = argObject._;
var email = argObject.email || argObject.e || argList[0];
var message = argObject.message || argObject.m || argList.slice(1).join(" ");
var isAnonymous = argObject.anonymous ? 1 : 0 || argObject.a ? 1 : 0;

if(argObject.token) {
	token.update(argObject.token);
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