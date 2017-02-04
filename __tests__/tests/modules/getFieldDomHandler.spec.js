/* @flow */

import {
  mockDummyLayerProps,
  mockPropsLevelHandlers,
  mockNormalizedField,
} from '../../helpers';

import { getFieldDomHandler } from '../../../src/modules/getFieldHandler';

describe('modules.getFieldDomHandler()', () => {
  it('returns field-level `onChange` when it is provided', () => {
    const layerId = 'dummyLayerId';
    const fieldId = 'dummyFieldId';
    const handlerKey = 'onChange';
    const field = mockNormalizedField({ handlers: { onChange: () => undefined } });
    const props = mockDummyLayerProps({
      handlers: mockPropsLevelHandlers({ onChange: () => undefined }),
    });
    const handler = getFieldDomHandler(
      layerId,
      fieldId,
      handlerKey,
      field.handlers,
      props.handlers,
    );

    // $FlowIgnoreMe: onChange is there
    expect(handler).toBe(field.handlers.onChange);
  });


  it('returns props-level `onChange` when field-level handler is not provided', () => {
    const layerId = 'dummyLayerId';
    const fieldId = 'dummyFieldId';
    const handlerKey = 'onChange';
    const field = mockNormalizedField({ handlers: undefined });
    const props = mockDummyLayerProps({
      handlers: mockPropsLevelHandlers({ onChange: () => undefined }),
    });
    const handler = getFieldDomHandler(
      layerId,
      fieldId,
      handlerKey,
      field.handlers,
      props.handlers,
    );

    expect(handler).toBe(props.handlers.onChange);
  });


  it('returns undefined when no `onBlur` is provided', () => {
    const layerId = 'dummyLayerId';
    const fieldId = 'dummyFieldId';
    const handlerKey = 'onBlur';
    const field = mockNormalizedField({ handlers: undefined });
    const props = mockDummyLayerProps({ handlers: mockPropsLevelHandlers() });
    const handler = getFieldDomHandler(
      layerId,
      fieldId,
      handlerKey,
      field.handlers,
      props.handlers,
    );

    expect(handler).toBe(undefined);
  });


  it('throws if `onChange` is not provided', () => {
    const layerId = 'dummyLayerId';
    const fieldId = 'dummyFieldId';
    const handlerKey = 'onChange';
    const field = mockNormalizedField({ handlers: undefined });
    const props = mockDummyLayerProps({
      handlers: mockPropsLevelHandlers({ onChange: undefined }),
    });
    const handlerGetter = () => getFieldDomHandler(
      layerId,
      fieldId,
      handlerKey,
      field.handlers,
      props.handlers,
    );

    expect(handlerGetter).toThrow();
  });


  it('throws if `onChange` is not a function', () => {
    const layerId = 'dummyLayerId';
    const fieldId = 'dummyFieldId';
    const handlerKey = 'onChange';
    const field = mockNormalizedField({ handlers: { onChange: 'not-a-function' } });
    const props = mockDummyLayerProps({
      handlers: mockPropsLevelHandlers({ onChange: undefined }),
    });
    const handlerGetter = () => getFieldDomHandler(
      layerId,
      fieldId,
      handlerKey,
      field.handlers,
      props.handlers,
    );

    expect(handlerGetter).toThrow();
  });
});
