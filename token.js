var fs = require('fs');
var mkdirp = require("mkdirp");

module.exports = Token = {
	update: function(token) {
		var data = {
			token: token
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
}