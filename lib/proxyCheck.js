/* -------------------------------------------------------------------------- */
/*                   Added by Mr. Wolf ( November 11, 2021 )                  */
/* -------------------------------------------------------------------------- */

const request = require('request');
const agent = require('socks5-http-client/lib/Agent');

var proxyCheck = proxyCheck || {};

proxyCheck = {
	check: (ip, port, username = null, password = null) => {
		const url = `http://google.com`;

		console.log(ip, port, username, password);

		var proxyRequest = request.defaults({
			agentClass: agent,
			agentOptions: {
				socksHost: ip,
				socksPort: port,
				socksUsername: username,
				socksPassword: password
			}
		});

		// return new Promise((resolve, reject) => {
		proxyRequest({ url: url, timeout: 12000 }, function(error, response) {
			console.log(error, 'error');
			console.log(response, 'response');
			// if (error || response.statusCode != 200 || !response.body) reject(error);
			// else resolve(`${ip}:${port}:${username}:${password}`);
		});
		// });
	}
};

module.exports = proxyCheck;
