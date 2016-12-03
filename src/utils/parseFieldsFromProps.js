import * as utils from '../utils';

export function parseFieldsFromProps(fields, data, parsedFields = [], parentKeyPath = []) {
  const names = Object.keys(fields);

  let index = -1;
  while (++index < names.length) {
    const name = names[index];
    const fieldsBranch = fields[name];
    const dataBranch = utils.fetchProp(data, name);
    const keyPath = parentKeyPath.concat(name);

    if (utils.isPlainObject(dataBranch)) {
      parseFieldsFromProps(fieldsBranch, dataBranch, parsedFields, keyPath);
    } else {
      const parsedField = (
        utils.isPlainObject(fieldsBranch)
        ? { keyPath, name, ...fieldsBranch }
        : { keyPath, name }
      );
      parsedFields.push(parsedField);
    }
  }

  return parsedFields;
}
