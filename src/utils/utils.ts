import { parse } from 'qs';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
// eslint-disable-next-line max-len
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path: string): boolean => reg.test(path);

const okResponse = (response: any): boolean => {
  if (response === '') {
    return true;
  }
  if (!response) {
    return false;
  }
  const code = response.code || null;
  return code === 200 || code === 201;
};

const getPageQuery = (): any => parse(window.location.href.split('?')[1]);

const parseQueryString = (queryString: string): object =>
  parse(queryString.indexOf('?') === 0 ? queryString.split('?')[1] : queryString);

const objectExcept = (obj: object, keys: string[]) => {
  const newObject = { ...obj };
  Object.keys(newObject).forEach(key => keys.includes(key) && delete newObject[key]);
  return newObject;
};

const objectOnly = (obj: object, keys: string[]) => {
  const newObject = { ...obj };
  Object.keys(newObject).forEach(key => keys.includes(key) || delete newObject[key]);
  return newObject;
};

const praseHttpParams = (params: object, parseBoolean: boolean = false) => {
  const newParams = { ...params };
  Object.keys(newParams).forEach(key => {
    if (parseBoolean && params[key] === true) {
      newParams[key] = 1;
    } else if (parseBoolean && params[key] === false) {
      newParams[key] = 0;
    } else if (typeof params[key] === 'undefined' || params[key] === null) {
      delete newParams[key];
    }
  });
  return newParams;
};

export { isUrl, okResponse, getPageQuery, parseQueryString, objectExcept, objectOnly, praseHttpParams };
