/* @flow */

import { mockDummyLayerProps, mockNormalizedField } from '../../helpers';

import { getFieldValueHandler } from '../../../src/modules/getFieldHandler';

describe('modules.getFieldValueHandler()', () => {
  it('returns field-level `filter` when it is provided', () => {
    const layerId = 'dummyLayerId';
    const fieldId = 'dummyFieldId';
    const handlerKey = 'filter';
    const field = mockNormalizedField({ filter: v => !!v });
    const props = mockDummyLayerProps({ filter: v => !!v });
    const filter = getFieldValueHandler(
      layerId,
      fieldId,
      handlerKey,
      field.filter,
      props.filter,
    );

    expect(filter).toBe(field.filter);
  });

  it('returns props-level `filter` when field-level handler is not provided', () => {
    const layerId = 'dummyLayerId';
    const fieldId = 'dummyFieldId';
    const handlerKey = 'filter';
    const field = mockNormalizedField({ filter: undefined });
    const props = mockDummyLayerProps({ filter: v => !!v });
    const filter = getFieldValueHandler(
      layerId,
      fieldId,
      handlerKey,
      field.filter,
      props.filter,
    );

    expect(filter).toBe(props.filter);
  });

  it('returns undefined when no `filter` is provided', () => {
    const layerId = 'dummyLayerId';
    const fieldId = 'dummyFieldId';
    const handlerKey = 'filter';
    const field = mockNormalizedField({ filter: undefined });
    const props = mockDummyLayerProps({ filter: undefined });
    const filter = getFieldValueHandler(
      layerId,
      fieldId,
      handlerKey,
      field.filter,
      props.filter,
    );

    expect(filter).toBe(undefined);
  });

  it('throws if `filter` is not a function', () => {
    const layerId = 'dummyLayerId';
    const fieldId = 'dummyFieldId';
    const handlerKey = 'filter';
    const field = mockNormalizedField({ filter: 'not-a-function' });
    const props = mockDummyLayerProps({ filter: undefined });
    const handlerGetter = () =>
      getFieldValueHandler(
        layerId,
        fieldId,
        handlerKey,
        // $FlowIgnoreMe: Intentional
        field.handlers,
        // $FlowIgnoreMe: Intentional
        props.handlers,
      );

    expect(handlerGetter).toThrow();
  });
});
