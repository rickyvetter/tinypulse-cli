# tinypulse

Spreading cheer and creating a strong and happy workforce - from the command line.

## use
```javascript
var tinypulse = require("tinypulse");
var cheers = tinypulse.cheers;

sendCheers({
	token: yourTinypulseResponseToken,
	email: "example@domain.com",
	message: "The team lunch you organized was as delicious as it was productive! Cheers.",
	isAnonymous: 0
}, function(err, data) {
	if(err) {
		console.log("Cheers was unsuccessful:", err);
	}
	else {
		console.log("Cheers sent!");
	}
});
```
or, `npm install tinypulse -g` and cheers from  the terminal:
```
$ cheers --token=<yourTinypulseResponseToken>
$ cheers angie Your speach was incredible and inspiring.
$ cheers example@domain.com This is an anonymous cheers -a
```

## api
Some direction on how to use tinypulse.

### cheers
This is a way to interact with a single user's cheers.

#### `sendCheers`
Arguments:

`options` is an object which takes the following properties:
 * `token` - string (required). The user's current `response_token`.
 * `email` - required. Accepts three different formats: `bill`, `angie@domain.com`, `["bill@domain.com", "angie"]`. The short name is the first part of their email; _not_ their first name.
 * `message` - string (required). The cheers you will be sending.
 * `isAnonymous` - bool/bit (optional - default `false`). Whether the cheers should be anonymous

`callback` is a function which will be called on completion with err and data params.

#### `getCheersPage`
Documentation coming.

### token
Token features were added in early testing and will likely be depricated in the near future. They are included here to allow this application to work as a command line tool. We will update the documentation when the direction we are going becomes clear.
