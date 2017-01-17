/* @flow */
/* eslint-disable no-use-before-define */

/**
 * @desc If value is `null` or `undefined`,
 *       then we should pass empty string as a DOM value.
 *
 */
export function normalizeValueForDom<V>(value: V): V | '' {
  return (
    isDefined(value) && !isNull(value)
    ? value
    : ''
  );
}


/**
 * @desc If key path consists of single attribute,
 *       user can pass it as a string.
 *       This function normalizes it to Array.
 *
 */
export function normalizeKeyPath(
  keyPath: string | Array<string>,
): Array<string> {
  return Array.isArray(keyPath) ? keyPath : [keyPath];
}


/**
 * @desc Retrives value of property at provided key path.
 *       Data container can be vanilla JS Object,
 *       as well as Immutable structure (e.g. Map).
 *
 */
export function fetchProp(
  container: Object, // eslint-disable-line flowtype/no-weak-types
  keyPath: string | Array<string>,
) {
  const normalizedKeyPath = normalizeKeyPath(keyPath);

  return (
    container.getIn && isFunction(container.getIn)
    ? container.getIn(normalizedKeyPath)
    : normalizedKeyPath.reduce((data, key) => data[key], container)
  );
}


export function isDefined<V>(value: V): boolean {
  return typeof value !== 'undefined';
}


export function isNull<V>(value: V): boolean {
  return value === null;
}


export function isString<V>(value: V): boolean {
  return typeof value === 'string';
}


export function isNumber<V>(value: V): boolean {
  return typeof value === 'number';
}


export function isPlainObject<V>(value: V): boolean {
  return (
    typeof value === 'object'
    && Object.prototype.toString.call(value) === '[object Object]'
  );
}

export function isFunction<V>(value: V): boolean {
  return typeof value === 'function';
}


export function isChangeEvent(event: SyntheticInputEvent): boolean {
  return event.type === 'change';
}


export function isBlurEvent(event: SyntheticInputEvent): boolean {
  return event.type === 'blur';
}
