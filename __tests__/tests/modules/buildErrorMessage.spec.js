/* @flow */

import buildErrorMessage from '../../../src/modules/buildErrorMessage';

describe('modules.buildErrorMessage()', () => {
  it('builds single-line error message from string', () => {
    const layerId = 'loginForm';
    const fieldId = 'email';
    const message = 'Boom!';
    const errorMessage = buildErrorMessage({ layerId, fieldId, message });

    expect(errorMessage).toBe(
      '[react-validation-layer]: Boom!\n--- Debug info:\n    Layer: loginForm\n    Field: email',
    );
  });


  it('builds multi-line error message from array', () => {
    const layerId = 'loginForm';
    const fieldId = 'email';
    const message = [
      'Look Ma!',
      'Multi-line!',
    ];
    const errorMessage = buildErrorMessage({ layerId, fieldId, message });

    expect(errorMessage).toBe(
      '[react-validation-layer]: Look Ma!\nMulti-line!\n--- Debug info:\n    Layer: loginForm\n    Field: email',
    );
  });


  it('builds error message without layerId when it\'s not provided', () => {
    const fieldId = 'email';
    const message = 'Boom!';
    const errorMessage = buildErrorMessage({ fieldId, message });

    expect(errorMessage).toBe(
      '[react-validation-layer]: Boom!\n--- Debug info:\n    Field: email',
    );
  });


  it('builds error message without layerId when it\'s default', () => {
    const layerId = 'form';
    const fieldId = 'email';
    const message = 'Boom!';
    const errorMessage = buildErrorMessage({ layerId, fieldId, message });

    expect(errorMessage).toBe(
      '[react-validation-layer]: Boom!\n--- Debug info:\n    Field: email',
    );
  });

  it('builds error message without fieldId when it\'s not provided', () => {
    const layerId = 'loginForm';
    const message = 'Boom!';
    const errorMessage = buildErrorMessage({ layerId, message });

    expect(errorMessage).toBe(
      '[react-validation-layer]: Boom!\n--- Debug info:\n    Layer: loginForm',
    );
  });


  it('builds error message without debug info when layerId & fieldId are not provided', () => {
    const message = 'Boom!';
    const errorMessage = buildErrorMessage({ message });

    expect(errorMessage).toBe(
      '[react-validation-layer]: Boom!',
    );
  });
});
