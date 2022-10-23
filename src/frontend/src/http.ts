import axios, { AxiosInterceptorOptions, AxiosRequestConfig, AxiosResponse } from 'axios';

const { REACT_APP_BASE_URL: baseURL } = process.env;

const instance = axios.create({
  baseURL,
  // timeout: 5000,
  // baseURL: 'http://localhost:1337',
});

export const HttpClient = instance;

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: async (url: string, config?: {}) => await instance.get(url, config).then(responseBody),
  post: async (url: string, body: {}, config?: {}) =>
    await instance.post(url, body, config).then(responseBody),
  put: async (url: string, body: {}, config?: {}) =>
    await instance.put(url, body, config).then(responseBody),
  delete: async (url: string, config?: {}) => await instance.delete(url, config).then(responseBody),
};

export const RequestInterceptor = (
  onFulfilled?:
    | ((
        value: AxiosRequestConfig<any>,
      ) => AxiosRequestConfig<any> | Promise<AxiosRequestConfig<any>>)
    | undefined,
  onRejected?: ((error: any) => any) | undefined,
  options?: AxiosInterceptorOptions | undefined,
) => {
  return instance.interceptors.request.use(onFulfilled, onRejected);
};

export const ResponseInterceptor = (
  onFulfilled?:
    | ((
        value: AxiosResponse<any, any>,
      ) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>)
    | undefined,
  onRejected?: ((error: any) => any) | undefined,
  options?: AxiosInterceptorOptions | undefined,
) => {
  return instance.interceptors.response.use(onFulfilled, onRejected);
};

// export const PendingRequests = instance.call

export default requests;