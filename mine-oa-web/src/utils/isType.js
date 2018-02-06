const types = {
  object: (value) => {
    return Object.prototype.toString.call(value) === '[object Object]';
  },
  array: (value) => {
    return Object.prototype.toString.call(value) === '[object Array]';
  },
  number: (value) => {
    return !!Number(value) || value === 0;
  },
}
export const isType = (args) => {
  const {
    value,
    type
  } = args;
  if (value === undefined) {
    return console.error('请传入验证值！');
  }
  return types[type].call(this, value);
}
export const queryType = (args) => {
  const {
    value,
  } = args;
  const typeKeys = Object.keys(types);
  const {
    length,
  } = typeKeys;
  for (let i = 0; i < length; i ++) {
    const currType = typeKeys[i];
    if (types[currType](value)) {
      return currType;
    }
  }
  return 'other';
}
