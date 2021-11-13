/* -------------------------------------------------------------------------- */
/*                   Added by Mr. Wolf ( November 11, 2021 )                  */
/* -------------------------------------------------------------------------- */

const request = require('./../index.js');

var proxyCheck = proxyCheck || {};

proxyCheck = {
	check: (url, port, username = null, password = null) => {}
};

exports.proxyCheck = proxyCheck;
