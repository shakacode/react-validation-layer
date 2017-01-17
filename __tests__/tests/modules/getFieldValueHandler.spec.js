/* @flow */

import { mockDummyLayerProps, mockNormalizedField } from '../../helpers';

import { getFieldValueHandler } from '../../../src/modules/getFieldHandler';

describe('modules.getFieldValueHandler()', () => {
  it('returns field-level `filter` when it is provided', () => {
    const handlerKey = 'filter';
    const field = mockNormalizedField({ filter: v => !!v });
    const props = mockDummyLayerProps({ filter: v => !!v });
    const filter = getFieldValueHandler(handlerKey, field, props);

    expect(filter).toBe(field.filter);
  });


  it('returns props-level `filter` when field-level handler is not provided', () => {
    const handlerKey = 'filter';
    const field = mockNormalizedField({ filter: undefined });
    const props = mockDummyLayerProps({ filter: v => !!v });
    const filter = getFieldValueHandler(handlerKey, field, props);

    expect(filter).toBe(props.filter);
  });


  it('returns undefined when no `filter` is provided', () => {
    const handlerKey = 'filter';
    const field = mockNormalizedField({ filter: undefined });
    const props = mockDummyLayerProps({ filter: undefined });
    const filter = getFieldValueHandler(handlerKey, field, props);

    expect(filter).toBe(undefined);
  });


  it('throws if `filter` is not a function', () => {
    const handlerKey = 'filter';
    const field = mockNormalizedField({ filter: 'not-a-function' });
    const props = mockDummyLayerProps({ filter: undefined });

    expect(() => getFieldValueHandler(handlerKey, field, props)).toThrow();
  });
});
