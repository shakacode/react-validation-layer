/* @flow */

import * as utils from '../../../../src/modules/utils';

describe('utils.isBlurEvent()', () => {
  it('returns `true` for blur event', () => {
    // $FlowIgnoreMe: Imitating SyntheticInputEvent
    const isBlurEvent = utils.isBlurEvent({ type: 'blur' });
    expect(isBlurEvent).toBe(true);
  });

  it('returns `false` for change event', () => {
    // $FlowIgnoreMe: Imitating SyntheticInputEvent
    const isBlurEvent = utils.isBlurEvent({ type: 'change' });
    expect(isBlurEvent).toBe(false);
  });

  it('returns `false` for undefined', () => {
    // $FlowIgnoreMe: Imitating SyntheticInputEvent
    const isBlurEvent = utils.isBlurEvent({});
    expect(isBlurEvent).toBe(false);
  });
});
