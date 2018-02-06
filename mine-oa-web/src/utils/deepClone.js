import {
  queryType,
} from './isType';
const __cloneArray = (array) => {
  const result = [];
  array.forEach((arrItem, index) => {
    const type = queryType(arrItem);
    result[index] = __solveChildren(
      type,
      arrItem,
    );
  });
  return result;
}
const __cloneObject = (obj) => {
  const result = {};
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    const value = result[key];
    const type = queryType(value);
    result[key] = __solveChildren(
      type,
      value,
    );
  });
  return result;
}
const __solveChildren = (type, value) => {
  if (type === 'array') {
    return __cloneArray(value);
  }
  if (type === 'object') {
    return __cloneObject(value);
  }
  return value;
}
const deepClone = (arg) => {
  const type = queryType(arg);
  return __solveChildren(type, arg);
}
export default deepClone;
