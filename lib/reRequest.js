/* -------------------------------------------------------------------------- */
/*                   Added by Mr. Wolf ( November 11, 2021 )                  */
/* -------------------------------------------------------------------------- */

const databaseQuery = require('./database/databaseQuery');
const saveData = require('./saveData');
const proxyCheck = require('./proxyCheck');

var reRequest = reRequest || {};

reRequest = {
	reRequest: async (options, callback) => {
		// console.log(options);
		const { requestData, dbType, saveUrl, proxiesList } = options;

		if (!requestData && typeof requestData != 'object') {
			callback(new Error('"requestData" not defined.'));

			return;
		}

		var saveOptions = {};

		// Connect to mongodb database
		if (dbType === 'json') {
			// Set default json path
			saveOptions.saveType = 'json';

			if (saveUrl) saveOptions.savePath = saveUrl;
		} else if (dbType === 'mongodb') {
			reRequest.connectDatabase(saveUrl, (error, connection) => {
				if (error) throw new Error(error);

				saveOptions.saveType = dbType;

				console.info('Database connected.');
			});
		}

		// Set proxy option
		saveOptions.proxy = await reRequest.availableProxy(proxiesList);

		// // Save request
		// saveData.save(requestData, saveOptions, (errorSaveData, returnData) => {
		// 	// Error while saving data
		// 	if (errorSaveData) {
		// 		callback(errorSaveData);

		// 		return;
		// 	}

		// 	callback({ status: true, requestID: returnData, availableProxy: saveOptions.proxy });
		// });
	},

	connectDatabase: (dbUrl, callback) => {
		databaseQuery.connectDatabase(dbUrl, (error, connection) => {
			if (error) {
				callback(error);

				return;
			}

			callback(null, connection);
		});
	},

	randomProxy: (proxiesList) => {
		return proxiesList[Math.floor(Math.random() * proxiesList.length)];
	},

	availableProxy: async (proxiesList) => {
		var selectedProxy = reRequest.randomProxy(proxiesList);

		const { 0: ip, 1: port, 2: username, 3: password } = selectedProxy.split(':');

		console.log(await proxyCheck.check(ip, port, username, password));

		// try {
		// 	console.log(await proxyCheck.check(ip, port, username, password));
		// } catch (error) {
		// 	// console.log(error, 'error');
		// 	// return reRequest.availableProxy(proxiesList);
		// }
	}
};

module.exports = reRequest;
