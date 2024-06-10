// Common api call function
import AppConfig from '../modals/AppConfig';
import './Global';

export const callApi = async (
	functionUrl = null,
	requestBody = {},
	method = 'POST',
	urlValue = null,
	headerVal = false,
	metaBody = false,
) => {
	// setting Body
	const requestInfo = JSON.stringify(requestBody);
	// Setting the Header
	let headers = {
		'Accept': 'application/json',
		// 'Content-Type': 'application/json',
		// 'Access-Control-Allow-Origin': global.baseUrl
	};
	if (AppConfig.api_key) {
		headers['Authorization'] = 'Bearer ' + AppConfig.api_key;
	}
	let requestObj = {
		method,
		headers: headers,
		body: requestInfo
	};
	if (metaBody) {
		requestBody['meta'] = metaBody;
	}
	if (headerVal !== false) {
		for (let i in headerVal) {
			headers[i] = headerVal[i];
		}
	}
	if (method === 'GET') {
		requestObj = {};
	}

	let url = global.baseUrl + functionUrl;
	if (global.apiUrls[functionUrl]) {
		url = global.baseUrl + global.apiUrls[functionUrl];
	}
	if (urlValue) {
		url = functionUrl ? (url + "/" + urlValue) : (url + urlValue);
	}
	// All core API will be called from here
	AppConfig.setLoader(true)
	return fetch(url, requestObj)
		.then(response => {
			const result = response.json();
			result.then(data => {
				AppConfig.setLoader(false)
				// We are checking common errors
				if (data.status === false && data.result && data.result.error === 31) {
					// Logout the user
				}
			});
			return result;
		})
		.catch(async error => {
			AppConfig.setLoader(false)
			// if (error.message === 'Network request failed') {

			// }
			throw error;
		});
};
