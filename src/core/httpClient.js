import { fetchJson } from './fetchJson';
import * as SecureStore from 'expo-secure-store';


const getOptions = async (options = {}) => {
	if (!options.headers) {
		options.headers = new Headers({ Accept: 'application/json' });
	}
	const token = await SecureStore.getItemAsync('token');
	options.headers.set('Authorization', `Bearer ${token}`);
	return options;
};

const httpClient = async (url, options = {}) => {
	const _options = await getOptions(options);
	return fetchJson(url, _options);
};

const httpClientRaw = (url, options = {}) => {
	const _options = getOptions(options);
	return fetch(url, _options);
};


export { httpClient, httpClientRaw };
