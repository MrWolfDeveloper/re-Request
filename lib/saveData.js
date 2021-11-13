const fs = require('fs');

const databaseQuery = require('./database/databaseQuery').database;

var saveData = saveData || {};

saveData = {
	defaultSavePath: './../storage/savedRequests.json',

	// Constructor function
	save: (data, options = null, callback) => {
		if (options !== null) {
			var { saveType } = options;

			// Set default save type.
			if (!saveType) saveType = 'json';

			// Set default path.
			if (options.savePath === null) options.savePath = saveData.defaultSavePath;

			var saveObject;

			// Detect first save or not?
			if (!data.requestID) {
				saveObject = saveData.createFirstRequest(data, options);
			} else {
				// Get request history.
				saveData.getRequestHistory(data.requestID, { saveType: saveType, savePath: savePath }, (history) => {
					saveObject = {
						requestID: saveData.generateRequestID(),
						requestUrl: data.requestUrl,
						requestCount: history.requestCount,
						requestHistory: history.requestHistory,
						options: options
					};
				});
			}

			switch (saveType) {
				case 'mongodb':
					databaseQuery.makeDatabaseQuery(
						{
							DBQueryMethod: 'insert',
							MethodData: {
								ModelName: 'reRequests',
								InsertData: saveObject
							}
						},
						(status, returnData, returnError) => {
							if (!status) {
								callback(new Error(returnError));
								return;
							}

							callback(null, returnData);
						}
					);
					break;
				default:
					try {
						callback(null, saveData.saveJSON(options.savePath, data));
					} catch (returnError) {
						callback(new Error(returnError));
					}
					break;
			}
		}
	},

	updateRequest: (requestID, newData, saveData) => {
		if (saveData.saveType === 'mongodb') {
		} else if (saveData.saveType === 'json') {
			var JSONData = JSON.parse(fs.readFileSync(saveData.savePath, 'utf8'));

			const requestInfo = saveData.searchJSONFile(requestID, saveData);

			Object.keys(newData, (keys) => {
				JSONData[requestInfo.index][keys] = newData[keys];
			});

			return fs.writeFileSync(saveData.savePath, JSON.stringify(JSONData), 'utf8');
		}
	},

	createFirstRequest: (data, options) => {
		return {
			requestID: saveData.generateRequestID(),
			requestUrl: data.requestUrl,
			requestCount: 0,
			requestHistory: [],
			options: options
		};
	},

	generateRequestID: () => {
		return parseInt(Math.random() * 100000000000000);
	},

	getRequestHistory: (requestID, saveData, callback) => {
		if (saveData.saveType === 'mongodb') {
			databaseQuery.makeDatabaseQuery(
				{
					DBQueryMethod: 'Select',
					MethodData: {
						ModelName: 'reRequests',
						SelectKeys: 'requestUrl requestCount requestHistory options',
						SelectOptions: {},
						Where: {
							requestID: parseInt(requestID)
						}
					}
				},
				(status, returnData, returnError) => {
					if (!status) {
						callback(new Error(returnError));
						return;
					}

					if (returnData.length)
						callback(null, {
							requestCount: returnData[0].requestCount,
							requestHistory: returnData[0].requestHistory
						});

					callback(null, {
						requestCount: 0,
						requestHistory: []
					});
				}
			);
		} else if (saveType === 'json') {
			callback(null, saveData.searchJSONFile(requestID, saveData));
		}
	},

	searchJSONFile: (requestID, saveData) => {
		var JSONData = JSON.parse(fs.readFileSync(saveData.savePath, 'utf8'));

		var filteredData = JSONData.filter((request, requestIndex) => {
			if (request.requestID === requestID) return { index: requestIndex, request: request };
		});

		return {
			index: filterData[0].index,
			requestCount: filteredData[0].request.requestCount,
			requestHistory: filteredData[0].request.requestHistory
		};
	},

	saveJSON: (savePath, data) => {
		try {
			if (!fs.existsSync(path)) return fs.writeFileSync(savePath, JSON.stringify(data), 'utf8');

			var lastFileData = fs.readFileSync(savePath, 'utf8');

			lastFileData.unshift(data);

			return fs.writeFileSync(savePath, JSON.stringify(lastFileData), 'utf8');
		} catch (returnError) {
			throw new Error(returnError);
		}
	}
};

exports.saveData = saveData;
