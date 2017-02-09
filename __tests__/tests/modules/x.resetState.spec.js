/* @flow */

// TODO: Move this to tests of instance methods of <ValidationLayer />

xit('test reset state');

// import resetState from '../../../src/modules/resetState';

// describe('modules.resetState()', () => {
//   xit('resets empty state', () => {
//     const state = {};
//     const nextFieldsPropsState = { 'fieldPropsState---email': { value: '@' } };
//     const nextState = resetState(state, nextFieldsPropsState);
//
//     expect(nextState).toEqual({ 'fieldPropsState---email': { value: '@' } });
//   });
//
//
//   xit('resets state with new state', () => {
//     const state = { 'fieldPropsState---email': { value: 'current' } };
//     const nextFieldsPropsState = { 'fieldPropsState---email': { value: 'next' } };
//     const nextState = resetState(state, nextFieldsPropsState);
//
//     expect(nextState).toEqual({ 'fieldPropsState---email': { value: 'next' } });
//   });
//
//
//   xit('resets state with new state and empties obsolete keys', () => {
//     const state = {
//       'fieldPropsState---email': { value: 'current' },
//       'fieldValidationState---email': { valid: true },
//     };
//     const nextFieldsPropsState = { 'fieldPropsState---email': { value: 'next' } };
//     const nextState = resetState(state, nextFieldsPropsState);
//
//     expect(nextState).toEqual({
//       'fieldPropsState---email': { value: 'next' },
//       'fieldValidationState---email': {},
//     });
//   });
// });
