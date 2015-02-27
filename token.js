var fs = require('fs');
var mkdirp = require("mkdirp");
var Browser = require("zombie");

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
	},

	addFromEmail: function(email, password){
		Browser.visit("http://mail.google.com/mail/h/", { debug: true, runScripts: false },
		 function (e, browser, status) {

		  browser.fill("Email", email).fill("Passwd", password)
		  .pressButton("signIn", function(result){
		  	browser.fill("q", "tinypulse")
		  	browser.document.querySelector("input").value = "tinypulse";
		  	browser.location = browser.window.location.href +  "?s=q&q=tinypulse&nvp_site_mail=Search+Mail&f=1&f=1&f=1";
			browser.wait(function() {
				var links = browser.queryAll("a");
			  	for(var i = 0; i < links.length; i++) {
					var emailTitle = browser.text(links[i]);
					if(emailTitle.indexOf("TINYpulse This Week") > -1 && emailTitle.indexOf("Fwd") === -1){
						browser.location = links[i].href
						browser.wait(function(){ 
							var emailLinks = browser.queryAll("a");
							for(var i = 0; i < emailLinks.length; i++) {
								var linkText = browser.text(emailLinks[i]);
								if(linkText.indexOf("Respond now") > -1){
									var token = emailLinks[i].href.split("%3D")[1].split("&")[0];
									var data = {
										token: token
									}
									fs.writeFile(dataPath, JSON.stringify(data), function(err) {
										if (err) {
											console.error(err);
										}
										else {
											console.log("Token added:", data.token);
										}
									});
									break;
								}
							}
						});

					
					}
			  	}
			  })
		  	})

		});
	}


}