// const saveData = require('./lib/saveData');
// const proxyCheck = require('./lib/proxyCheck');

// const databaseQuery = require('./lib/database/databaseQuery');

// databaseQuery.connectDatabase(
// 	'mongodb+srv://MrWolf:Aa106677889@exbdatabse.xnwy0.mongodb.net/exbdatabse?retryWrites=true&w=majority',
// 	(error, connection) => {
// 		if (error) throw new Error(error);

// 		/* ------------------------------- Proxy check ------------------------------ */
// 		// proxyCheck.check('5.183.60.39', '7051', 'qjlwviby', 'w5c26wswi5xi', (error, connectionStatus) => {
// 		// 	if (error) throw new Error(error);

// 		// 	return;
// 		// });

// 		/* ------------------------------ Save request ------------------------------ */
// 		// saveData.save(
// 		// 	{
// 		// 		requestUrl: 'https://google.com/test'
// 		// 	},
// 		// 	{
// 		// 		saveType: 'json'
// 		// 	},
// 		// 	(errorSaveData, returnData) => {
// 		// 		if (errorSaveData) throw new Error(errorSaveData);

// 		// 		console.log(returnData);
// 		// 	}
// 		// );

// 		/* ----------------------------- Update request ----------------------------- */
// 		// saveData.update(
// 		// 	{
// 		// 		newData: {
// 		// 			requestID: 64133050842020,
// 		// 			requestUrl: 'https://google.com/test',
// 		// 			status: 'failed'
// 		// 		},
// 		// 		options: {
// 		// 			saveType: 'mongodb'
// 		// 		}
// 		// 	},
// 		// 	(errorSaveData, returnData) => {
// 		// 		if (errorUpdateData) throw new Error(errorSaveData);

// 		// 		console.log(returnData);
// 		// 	}
// 		// );
// 	}
// );

const request = require('./index');

request(
	'http://www.google.com',
	{
		reRequest: {
			dbType: 'json',
			proxiesList: [
				'5.183.60.39:7051:qjlwviby:w5c26wswi5xi',
				'88.218.149.181:6448:qjlwviby:w5c26wswi5xi',
				'88.218.149.31:6298:qjlwviby:w5c26wswi5xi',
				'88.218.148.42:6053:qjlwviby:w5c26wswi5xi',
				'5.183.61.121:7389:qjlwviby:w5c26wswi5xi',
				'88.218.149.71:6338:qjlwviby:w5c26wswi5xi',
				'5.183.61.9:7277:qjlwviby:w5c26wswi5xi',
				'88.218.149.233:6500:qjlwviby:w5c26wswi5xi',
				'5.183.61.26:7294:qjlwviby:w5c26wswi5xi',
				'5.183.61.170:7438:qjlwviby:w5c26wswi5xi'
			],
			validator: (returnData) => {
				console.log(returnData, 'validator');
			}
		}
	},
	function(error, response, body) {
		// console.error('error:', error); // Print the error if one occurred
		// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		// console.log('body:', body); // Print the HTML for the Google homepage.
	}
);
