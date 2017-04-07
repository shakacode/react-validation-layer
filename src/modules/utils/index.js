/* @flow */
/* eslint-disable no-use-before-define */

import * as _ from './lodash';

import type { Value } from '../../types';

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
export function getProp(
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


/**
 * @desc Sets value of property at provided key path.
 *       Data container can be vanilla JS Object,
 *       as well as Immutable structure (e.g. Map).
 *
 */
export function setProp(
  container: Object, // eslint-disable-line flowtype/no-weak-types
  keyPath: string | Array<string>,
  value: Value,
) {
  const normalizedKeyPath = normalizeKeyPath(keyPath);

  return (
    container.setIn && isFunction(container.setIn)
    ? container.setIn(normalizedKeyPath, value)
    : _.set(_.cloneDeep(container), keyPath, value)
  );
}


export function isDefined<S>(subject: S): boolean {
  return typeof subject !== 'undefined';
}


export function isNull<S>(subject: S): boolean {
  return subject === null;
}


export function isString<S>(subject: S): boolean {
  return typeof subject === 'string';
}


export function isNumber<S>(subject: S): boolean {
  return typeof subject === 'number';
}


export function isObject<S>(subject: S): boolean {
  return typeof subject === 'object';
}

export function isPlainObject<S>(subject: S): boolean {
  return (
    isObject(subject)
    && Object.prototype.toString.call(subject) === '[object Object]'
  );
}

export function isFunction<S>(subject: S): boolean {
  return typeof subject === 'function';
}

// eslint-disable-next-line flowtype/no-weak-types
export function isPromise<V, S: Promise<V> | Object>(subject: S): boolean {
  return (
    !!subject
    && (isObject(subject) || isFunction(subject))
    && isFunction(subject.then)
  );
}

export function isChangeEvent(event: SyntheticInputEvent): boolean {
  return event.type === 'change';
}


export function isBlurEvent(event: SyntheticInputEvent): boolean {
  return event.type === 'blur';
}
