var mongoose = require('mongoose');

var reRequestsSchema = new mongoose.Schema({
	requestID: Number,
	requestUrl: String,
	requestDate: Date,
	options: Object,
	status: {
		type: String,
		enum: [ 'success', 'failed', 'pending' ]
	}
});

var reRequests = mongoose.model('reRequests', reRequestsSchema);
module.exports = reRequests;
