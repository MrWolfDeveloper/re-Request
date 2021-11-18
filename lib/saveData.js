const fs = require('fs');

const databaseQuery = require('./database/databaseQuery').database;

var saveData = saveData || {};

saveData = {
	defaultSavePath: __dirname + '/storage/savedRequests.json',

	// Constructor function for save new request
	save: (data, options, callback) => {
		if (!options) {
			// Set default options
			var options = { saveType: 'json', savePath: saveData.defaultSavePath };
		} else {
			// We have not save path for mongodb save
			if (options.saveType === 'mongodb') options.savePath = '';
			else {
				// Set default path for save json.
				if (!options.savePath) options.savePath = saveData.defaultSavePath;
			}
		}

		// Create save object
		var saveObject = {
			requestID: saveData.generateRequestID(),
			requestUrl: data.requestUrl,
			requestDate: new Date(),
			options: options,
			status: data.status
		};

		// Save request on mongodb or json file
		if (options.saveType === 'mongodb') {
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

					callback(null, true);
				}
			);
		} else if (options.saveType === 'json') {
			try {
				callback(null, saveData.saveJSON(options.savePath, saveObject));
			} catch (returnError) {
				callback(new Error(returnError));
			}
		}

		// Do action
		// saveData.saveAction(saveObject, options, (error, returnData) => {
		// 	if (error) {
		// 		callback(error);
		// 		return;
		// 	}

		// 	callback(null, returnData);
		// });
		// } else {
		// 	// Get request history.
		// 	saveData.getRequestHistory(
		// 		data.requestID,
		// 		{ saveType: options.saveType, savePath: options.savePath },
		// 		(error, history) => {
		// 			if (error) throw new Error(error);

		// 			history.requestHistory.push({
		// 				requestDate: new Date(),
		// 				options: options
		// 			});

		// 			saveObject = {
		// 				// requestID: data.requestID,
		// 				requestUrl: data.requestUrl,
		// 				// requestCount: parseInt(history.requestCount) + 1,
		// 				// requestHistory: history.requestHistory,
		// 				options: history.options
		// 			};

		// 			console.log(saveObject, 'saveObject');

		// 			// Do action
		// 			saveData.saveAction(saveObject, options, (error, returnData) => {
		// 				if (error) {
		// 					callback(error);
		// 					return;
		// 				}

		// 				callback(null, returnData);
		// 			});
		// 		}
		// 	);
		// }
	},

	// Constructor function for update new request
	update: (data, callback) => {
		if (data.options.saveType === 'mongodb') {
			databaseQuery.makeDatabaseQuery(
				{
					DBQueryMethod: 'update',
					MethodData: {
						ModelName: 'reRequests',
						MongooseUMO: { multi: false },
						NewData: {
							$set: data
						},
						Which: {
							requestID: data.requestID
						}
					}
				},
				(status, returnData, returnError) => {
					if (!status) {
						callback(new Error(returnError));
						return;
					}

					callback(null, true);
				}
			);
		} else if (data.options.saveType === 'json') {
			var JSONData = JSON.parse(fs.readFileSync(data.options.savePath, 'utf8'));

			const requestInfo = saveData.searchJSONFile(data.requestID, data.options);

			JSONData[requestInfo.index] = newData;

			callback(null, fs.writeFileSync(data.options.savePath, JSON.stringify(JSONData), 'utf8'));
		}
	},

	// Select request in json file
	searchJSONFile: (requestID, saveOptions) => {
		var JSONData = JSON.parse(fs.readFileSync(saveOptions.savePath, 'utf8'));

		var filteredData = JSONData.filter((request, requestIndex) => {
			if (request.requestID === requestID) return { index: requestIndex, request: request };
		});

		var filteredIndex = JSONData.findIndex((request, requestIndex) => {
			if (request.requestID === requestID) return { index: requestIndex, request: request };
		});

		if (filteredIndex < 0)
			return {
				index: -1,
				requestCount: 0,
				requestHistory: [],
				options: {}
			};
		else
			return {
				index: filteredIndex,
				requestCount: filteredData[0].requestCount,
				requestHistory: filteredData[0].requestHistory,
				options: filteredData[0].options
			};
	},

	// Save or update data in json file
	saveJSON: (savePath, data) => {
		try {
			if (!fs.existsSync(savePath)) {
				data = [ data ];
				return fs.writeFileSync(savePath, JSON.stringify(data), 'utf8');
			}

			var lastFileData = JSON.parse(fs.readFileSync(savePath, 'utf8'));

			lastFileData.unshift(data);

			fs.writeFileSync(savePath, JSON.stringify(lastFileData), 'utf8');

			return true;
		} catch (returnError) {
			throw new Error(returnError);
		}
	},

	// Generate request Id for new requests
	generateRequestID: () => {
		return parseInt(Math.random() * 100000000000000);
	},

	timeoutRequest: () => {}

	/* ------------------------------- Old options ------------------------------ */

	// saveAction: (saveObject, options, callback) => {
	// 	// if (saveObject.requestCount === 1) {
	// 	// Save data

	// 	// } else {
	// 	// 	console.log('Updating ...');
	// 	// 	// Update data
	// 	// 	saveData.updateRequest(
	// 	// 		saveObject.requestID,
	// 	// 		saveObject,
	// 	// 		{ saveType: options.saveType, savePath: options.savePath },
	// 	// 		(error, returnData) => {
	// 	// 			if (error) {
	// 	// 				callback(error);
	// 	// 				return;
	// 	// 			}

	// 	// 			callback(null, returnData);
	// 	// 		}
	// 	// 	);
	// 	// }
	// },

	// saveRequest: (insertData, saveOptions, callback) => {
	// 	if (saveOptions.saveType === 'mongodb') {
	// 		databaseQuery.makeDatabaseQuery(
	// 			{
	// 				DBQueryMethod: 'insert',
	// 				MethodData: {
	// 					ModelName: 'reRequests',
	// 					InsertData: insertData
	// 				}
	// 			},
	// 			(status, returnData, returnError) => {
	// 				if (!status) {
	// 					callback(new Error(returnError));
	// 					return;
	// 				}

	// 				callback(null, returnData);
	// 			}
	// 		);
	// 	} else if (saveOptions.saveType === 'json') {
	// 		try {
	// 			callback(null, saveData.saveJSON(saveOptions.savePath, insertData));
	// 		} catch (returnError) {
	// 			callback(new Error(returnError));
	// 		}
	// 	}
	// },

	// createFirstRequest: (data, options) => {
	// return {
	// 	// requestID: saveData.generateRequestID(),
	// 	requestUrl: data.requestUrl,
	// 	// requestCount: 1,
	// 	// requestHistory: [],
	// 	options: options,
	// 	status: data.status
	// };
	// },

	// getRequestHistory: (requestID, saveOptions, callback) => {
	// 	if (saveOptions.saveType === 'mongodb') {
	// 		databaseQuery.makeDatabaseQuery(
	// 			{
	// 				DBQueryMethod: 'select',
	// 				MethodData: {
	// 					ModelName: 'reRequests',
	// 					SelectKeys: 'requestUrl requestCount requestHistory options',
	// 					SelectOptions: {},
	// 					Where: {
	// 						requestID: parseInt(requestID)
	// 					}
	// 				}
	// 			},
	// 			(status, returnData, returnError) => {
	// 				if (!status) {
	// 					callback(new Error(returnError));
	// 					return;
	// 				}

	// 				if (returnData.length)
	// 					callback(null, {
	// 						requestCount: returnData[0].requestCount,
	// 						requestHistory: returnData[0].requestHistory,
	// 						options: returnData[0].options
	// 					});
	// 				else
	// 					callback(null, {
	// 						requestCount: 0,
	// 						requestHistory: [],
	// 						options: {}
	// 					});
	// 			}
	// 		);
	// 	} else if (saveOptions.saveType === 'json') {
	// 		var searchJSON = saveData.searchJSONFile(requestID, saveOptions);

	// 		if (searchJSON.index < 0) {
	// 			callback(new Error('Request ID not found.'));
	// 			return;
	// 		}

	// 		callback(null, searchJSON);
	// 	}
	// },
};

exports.saveData = saveData;
