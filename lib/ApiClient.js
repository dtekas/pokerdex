const request = require('request-promise-native');
const _ = require('lodash');

let instance = null;

let errorCodes = {
	"404": "NOT_FOUND",
	"DEFAULT": "GENERIC_ERROR"
};

class ApiClient {
	constructor() {
		if(!instance) {
			instance = this;
		}
		this._requestHeaders = {
			"Content-Type": "application/json",
		};
		return instance;
	}

	call(url, callParams) {
		let params = {},
			requestHeaders = Object.assign({}, this._requestHeaders);


		if (callParams !== undefined) {
			params = callParams;
		}

		if (params.headers !== undefined) {
			Object.assign(requestHeaders, params.headers);
		}

		let logHeader = `API: ${url}`;

		let requestOptions = {
			url: url,
			headers: requestHeaders
		};

		if (params.method) {
			requestOptions.method = params.method;
		}

		if (params.data) {
			requestOptions.body = [JSON.stringify(params.data)];
		}
		console.log(requestOptions.method, "Request for url : ", requestOptions.url);
		let timestamp = Date.now();
		return request(requestOptions).then(function (response) {
			var apiTime = (Date.now() - timestamp) / 1000 + "s";
			console.log(logHeader, "SUCCESS", apiTime, "***");
			return JSON.parse(response);

		}, function(response) {
			var apiTime = (Date.now() - timestamp) / 1000 + "s";
			console.log(logHeader, "FAILURE", response.statusCode, apiTime, "***", response.error);
			return Promise.reject({
				statusCode: response.statusCode,
				code: errorCodes[response.statusCode], //Can create specific textual error code based on statusCode
				message: JSON.parse(response.error)
			});
		});

	}

	static sendResponse(res, promise) {
		promise.then(function(result) {
			return res.json({
				success: true,
				result: result
			}).end();
		})
		.catch(function(error) {
			return res.status(500).json({
				success: false,
				code: error.code,
				message: error.message
			}).end();

		});
	}

	static apiGet(url, callParams = {}) {
		Object.assign(callParams, {method: "GET"});
		return new ApiClient().call(url, callParams);
	}

}


module.exports = ApiClient;


