const saveData = require('./lib/saveData').saveData;

const databaseQuery = require('./lib/database/databaseQuery').database;

databaseQuery.connectDatabase(
	'mongodb+srv://MrWolf:Aa106677889@exbdatabse.xnwy0.mongodb.net/exbdatabse?retryWrites=true&w=majority',
	(error, connection) => {
		if (error) throw new Error(error);

		saveData.save(
			{
				requestUrl: 'https://google.com/test',
				status: 'pending'
			},
			{
				saveType: 'mongodb'
			},
			(errorSaveData, returnData) => {
				if (errorSaveData) throw new Error(errorSaveData);

				console.log(returnData);
			}
		);
	}
);
