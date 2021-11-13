var Mongoose = require('mongoose');

var reRequestsSchema = new Mongoose.Schema({
	requestID: Number,
	requestUrl: String,
	requestCount: Number,
	requestHistory: Array,
	options: Object
});

var reRequests = Mongoose.model('reRequests', reRequestsSchema);
module.exports = reRequests;
