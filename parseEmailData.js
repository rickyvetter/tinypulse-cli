var ast = require("ast-query");

var parseEmailData = function(script) {
	var scriptObject = ast(script);
	var params = scriptObject.body.node[0].expression.arguments[0].body.body[0].expression.arguments;
	var users = JSON.parse(script.slice(params[1].range[0], params[1].range[1]));//.apply(params[1].range);
	var emails = users.map(function(user) {
		return user.email;
	});
	var sender = params[2].value;
	var domain = sender.match(/^([\w\.]+)@([\w\.]+)$/)[2];
	return {
		emails: emails,
		sender: sender,
		domain: domain
	};
};

module.exports = parseEmailData;