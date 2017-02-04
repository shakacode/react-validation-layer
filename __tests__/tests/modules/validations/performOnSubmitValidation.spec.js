/* @flow */

import { performOnSubmitValidation } from '../../../../src/modules/validations';

describe('modules.validation.performOnSubmitValidation()', () => {
  it('reports invalid status when first field is invalid', () => {
    const data = { email: '', password: '42' };
    const state = {};
    const fields = [
      { id: 'email', keyPath: ['email'], validate: () => false },
      { id: 'password', keyPath: ['password'], validate: () => true },
    ];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: false, status: 'failure' },
        'fieldValidationState---password': { valid: true, status: 'success' },
      },
      isValid: false,
    });
  });


  it('reports invalid status when second field is invalid', () => {
    const data = { email: '@', password: '' };
    const state = {};
    const fields = [
      { id: 'email', keyPath: ['email'], validate: () => true },
      { id: 'password', keyPath: ['password'], validate: () => false },
    ];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: true, status: 'success' },
        'fieldValidationState---password': { valid: false, status: 'failure' },
      },
      isValid: false,
    });
  });


  it('reports invalid status when both fields are invalid', () => {
    const data = { email: '', password: '' };
    const state = {};
    const fields = [
      { id: 'email', keyPath: ['email'], validate: () => false },
      { id: 'password', keyPath: ['password'], validate: () => false },
    ];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: false, status: 'failure' },
        'fieldValidationState---password': { valid: false, status: 'failure' },
      },
      isValid: false,
    });
  });


  it('reports valid status when both fields are valid', () => {
    const data = { email: '@', password: '42' };
    const state = {};
    const fields = [
      { id: 'email', keyPath: ['email'], validate: () => true },
      { id: 'password', keyPath: ['password'], validate: () => true },
    ];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: true, status: 'success' },
        'fieldValidationState---password': { valid: true, status: 'success' },
      },
      isValid: true,
    });
  });


  it('updates state with the new key', () => {
    const data = { email: '' };
    const state = {};
    const fields = [{ id: 'email', keyPath: ['email'], validate: () => false }];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: false, status: 'failure' },
      },
      isValid: false,
    });
  });


  it('merges next state if next and current states are invalid', () => {
    const data = { email: '' };
    const state = {
      'fieldValidationState---email': { valid: false, status: 'current-status' },
    };
    const fields = [{
      id: 'email',
      keyPath: ['email'],
      validate: () => ({ valid: false, status: 'next-status' }),
    }];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: false, status: 'next-status' },
      },
      isValid: false,
    });
  });


  it('merges next state if next state is invalid and current state is valid', () => {
    const data = { email: '' };
    const state = {
      'fieldValidationState---email': { valid: true, status: 'current-status' },
    };
    const fields = [{
      id: 'email',
      keyPath: ['email'],
      validate: () => ({ valid: false, status: 'next-status' }),
    }];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: false, status: 'next-status' },
      },
      isValid: false,
    });
  });


  it('merges next state if next state is valid and current state is invalid & not async', () => {
    const data = { email: '' };
    const state = {
      'fieldValidationState---email': { valid: false, status: 'current-status' },
    };
    const fields = [{
      id: 'email',
      keyPath: ['email'],
      validate: () => ({ valid: true, status: 'next-status' }),
    }];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: true, status: 'next-status' },
      },
      isValid: true,
    });
  });


  it('keeps current state if next state is valid and current state is invalid & async', () => {
    const data = { email: '' };
    const state = {
      'fieldValidationState---email': { valid: false, status: 'current-status', isAsync: true },
    };
    const fields = [{
      id: 'email',
      keyPath: ['email'],
      validate: () => ({ valid: true, status: 'next-status' }),
    }];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: false, status: 'current-status', isAsync: true },
      },
      isValid: false,
    });
  });


  it('merges next state if next state is valid and current state is valid & not async', () => {
    const data = { email: '' };
    const state = {
      'fieldValidationState---email': { valid: true, status: 'current-status' },
    };
    const fields = [{
      id: 'email',
      keyPath: ['email'],
      validate: () => ({ valid: true, status: 'next-status' }),
    }];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: true, status: 'next-status' },
      },
      isValid: true,
    });
  });


  it('keeps current state if next state is valid and current state is valid & async', () => {
    const data = { email: '' };
    const state = {
      'fieldValidationState---email': { valid: true, status: 'current-status', isAsync: true },
    };
    const fields = [{
      id: 'email',
      keyPath: ['email'],
      validate: () => ({ valid: true, status: 'next-status' }),
    }];
    const statuses = {};
    const layerId = 'dummyId';

    const resolution = performOnSubmitValidation(data, state, fields, statuses, layerId);

    expect(resolution).toEqual({
      validationState: {
        'fieldValidationState---email': { valid: true, status: 'current-status', isAsync: true },
      },
      isValid: true,
    });
  });
});
