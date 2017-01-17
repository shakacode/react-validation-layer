/* @flow */

import {
  mockDummyLayerProps,
  mockPropsLevelHandlers,
  mockNormalizedField,
} from '../../helpers';

import { getFieldDomHandler } from '../../../src/modules/getFieldHandler';

describe('modules.getFieldDomHandler()', () => {
  it('returns field-level `onChange` when it is provided', () => {
    const handlerKey = 'onChange';
    const field = mockNormalizedField({ handlers: { onChange: () => undefined } });
    const props = mockDummyLayerProps({
      handlers: mockPropsLevelHandlers({ onChange: () => undefined }),
    });
    const handler = getFieldDomHandler(handlerKey, field, props);

    // $FlowIgnoreMe: onChange is there
    expect(handler).toBe(field.handlers.onChange);
  });


  it('returns props-level `onChange` when field-level handler is not provided', () => {
    const handlerKey = 'onChange';
    const field = mockNormalizedField({ handlers: undefined });
    const props = mockDummyLayerProps({
      handlers: mockPropsLevelHandlers({ onChange: () => undefined }),
    });
    const handler = getFieldDomHandler(handlerKey, field, props);

    expect(handler).toBe(props.handlers.onChange);
  });


  it('returns undefined when no `onBlur` is provided', () => {
    const handlerKey = 'onBlur';
    const field = mockNormalizedField({ handlers: undefined });
    const props = mockDummyLayerProps({ handlers: mockPropsLevelHandlers() });
    const handler = getFieldDomHandler(handlerKey, field, props);

    expect(handler).toBe(undefined);
  });


  it('throws if `onChange` is not provided', () => {
    const handlerKey = 'onChange';
    const field = mockNormalizedField({ handlers: undefined });
    const props = mockDummyLayerProps({
      handlers: mockPropsLevelHandlers({ onChange: undefined }),
    });

    expect(() => getFieldDomHandler(handlerKey, field, props)).toThrow();
  });


  it('throws if `onChange` is not a function', () => {
    const handlerKey = 'onChange';
    const field = mockNormalizedField({ handlers: { onChange: 'not-a-function' } });
    const props = mockDummyLayerProps({
      handlers: mockPropsLevelHandlers({ onChange: undefined }),
    });

    expect(() => getFieldDomHandler(handlerKey, field, props)).toThrow();
  });
});
