// import { fetch } from 'whatwg-fetch';
import { path, proxy } from './path';

const types = ['json', 'html', 'text'];
const methods = ['GET', 'POST', 'PUT', 'DELETE'];

/**
 * 封装的fetch请求
 * @param { key } 请求地址对应的简写key
 * @param { url } 请求地址，当传入此参数时，key将会失效
 * @param { method } 请求方式，只支持fetch自带的方法枚举，比如大写POST
 * @param { data } 请求参数，可以是对象或数组
 * @param { type } 解析方式，枚举['json', 'html', 'text']，默认为json
 * @param { params } 当需要设置header时可以用这个
 * @param { success } 请求结束时的回调
 * @param { fix } 使用代理时，被代理地址参数分隔符
 * @param { isProxy } 是否启用代理，默认为 false
 * @param { error } 异常抛出
 */
export const ajax = ({
  url,
  key,
  method = 'GET',
  data,
  type = 'json',
  success,
  params,
  fix = '&',
  isProxy = false,
  error,
}) => {
  let realUrl,
    realParams,
    postParam = {};

  checkType(type);

  checkMethod(method);

  realUrl = getRealUrl(key, path, proxy, isProxy) || url;

  realParams = getRealParams(realUrl, data, fix);

  if (method != 'GET') {
    postParam = {
      body: JSON.stringify(data),
      method,
      headers: { 'Content-Type': 'application/json' },
    };
  }

  postParam = Object.assign({}, postParam, params);

  fetch(realUrl + realParams, postParam)
    .then(result => result[type]())
    .then(result => success && success(result))
    .catch(err => error && error(err));
};

export const checkMethod = method => {
  if (!method) {
    console.error('fetch method is undefined.');

    return;
  }

  method = method.toUpperCase();

  if (!methods.includes(method)) {
    console.error('fetch method error.');

    return;
  }

  return method;
};

export const checkType = type => {
  if (!type) {
    console.error('fetch type is undefined.');

    return;
  }

  type = type.toLowerCase();

  if (!types.includes(type)) {
    console.error('fetch type error.');

    return;
  }

  return type;
};

export const getRealParams = (url, data, fixStr) => {
  if (!url || !data) {
    return '';
  }

  let fix = url.includes('?') ? fixStr : '?';
  let result = serialize(data, fixStr);

  if (result) {
    return fix + result;
  }

  return result;
};

export const serialize = (data, fixStr) => {
  if (!data || Object.keys(data).lenght == 0 || data instanceof Array) {
    return '';
  }

  if (typeof data == 'string') {
    return data;
  }

  let paramStr = '';

  for (let key in data) {
    paramStr += `${key}=${data[key]}${fixStr}`;
  }

  paramStr = paramStr.substr(0, paramStr.length - (fixStr == '&' ? 1 : 3));

  return paramStr;
};

export const getRealUrl = (key, path, proxy, isProxy) => {
  let realUrl;

  for (let realKey in path) {
    if (key == realKey) {
      realUrl = path[realKey];

      break;
    }
  }

  if (!realUrl) {
    return;
  }

  if (proxy && isProxy) {
    realUrl = proxy + realUrl;
  }

  return realUrl;
};
