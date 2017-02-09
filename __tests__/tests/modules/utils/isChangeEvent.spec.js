/* @flow */

import * as utils from '../../../../src/modules/utils';

describe('utils.isChangeEvent()', () => {
  it('returns `true` for change event', () => {
    // $FlowIgnoreMe: Imitating SyntheticInputEvent
    const isChangeEvent = utils.isChangeEvent({ type: 'change' });
    expect(isChangeEvent).toBe(true);
  });

  it('returns `false` for blur event', () => {
    // $FlowIgnoreMe: Imitating SyntheticInputEvent
    const isChangeEvent = utils.isChangeEvent({ type: 'blur' });
    expect(isChangeEvent).toBe(false);
  });

  it('returns `false` for undefined', () => {
    // $FlowIgnoreMe: Imitating SyntheticInputEvent
    const isChangeEvent = utils.isChangeEvent({});
    expect(isChangeEvent).toBe(false);
  });
});
