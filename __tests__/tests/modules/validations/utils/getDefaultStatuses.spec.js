/* @flow */

import { getDefaultStatuses } from '../../../../../src/modules/validations/utils';

describe('modules.validation.utils.getDefaultStatuses()', () => {
  it('returns custom statuses from props when provided', () => {
    const statusesFromProps = { success: 'succeeded', failure: 'failed' };
    const statuses = getDefaultStatuses(statusesFromProps);

    expect(statuses).toEqual(statusesFromProps);
  });

  it('returns default statuses when no custom statuses provided', () => {
    const statusesFromProps = undefined;
    const statuses = getDefaultStatuses(statusesFromProps);

    expect(statuses).toEqual({ success: 'success', failure: 'failure' });
  });

  it('returns default success status when no custom success statuses provided', () => {
    const statusesFromProps = { failure: 'failed' };
    const statuses = getDefaultStatuses(statusesFromProps);

    expect(statuses).toEqual({ success: 'success', failure: 'failed' });
  });

  it('returns default failure status when no custom failure statuses provided', () => {
    const statusesFromProps = { success: 'succeeded' };
    const statuses = getDefaultStatuses(statusesFromProps);

    expect(statuses).toEqual({ success: 'succeeded', failure: 'failure' });
  });
});
