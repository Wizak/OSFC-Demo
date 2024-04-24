import { API_URL } from '../core/consts';


class HttpError extends Error {
  constructor(message, status, body = null) {
    super(message);
    this.message = message;
    this.status = status;
    this.body = body;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    } else {
      this.stack = (new Error()).stack;
    }
    this.name = this.constructor.name;
  }
};


const createHeadersFromOptions = (options) => {
  const requestHeaders = (options.headers ||
    new Headers({
        Accept: 'application/json',
    }));
  if (
    !requestHeaders.has('Content-Type') &&
    !(options && (!options.method || options.method === 'GET')) &&
    !(options && options.body && options.body instanceof FormData)
  ) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  if (options.user && options.user.authenticated && options.user.token) {
    requestHeaders.set('Authorization', options.user.token);
  }

  return requestHeaders;
};

const fetchJson = (url, options) => {
  const requestHeaders = createHeadersFromOptions(options);

  return fetch(API_URL + url, { ...options, headers: requestHeaders })
    .then(response =>
      response.text().then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text,
      }))
    )
    .then(({ status, statusText, headers, body }) => {
      let json;
      try {
        json = JSON.parse(body);
      } catch (e) {
        // not json, no big deal
      }
      if (status < 200 || status >= 300) {
        return Promise.reject(
          new HttpError(
            (json && json.message) || statusText,
            status,
            json
          )
        );
      }
      return Promise.resolve({ status, headers, body, json });
    });
};


export { fetchJson };
