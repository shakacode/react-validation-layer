/* @flow */
/* eslint-disable max-len */

import normalizeExternalErrors from '../../../src/modules/normalizeExternalErrors';

describe('modules.normalizeExternalErrors()', () => {
  it('combines array of errors from flat object w/ errors as strings', () => {
    const errors = {
      email: 'Email error',
      password: 'Password error',
    };
    const normalizedErrors = normalizeExternalErrors(errors);

    expect(normalizedErrors).toEqual([
      { fieldId: 'email', message: 'Email error' },
      { fieldId: 'password', message: 'Password error' },
    ]);
  });

  it('combines array of errors from flat object w/ one of the errors as an array', () => {
    const errors = {
      email: 'Email error',
      password: ['Password error 1', 'Password error 2'],
    };
    const normalizedErrors = normalizeExternalErrors(errors);

    expect(normalizedErrors).toEqual([
      { fieldId: 'email', message: 'Email error' },
      {
        fieldId: 'password',
        message: ['Password error 1', 'Password error 2'],
      },
    ]);
  });

  it('combines array of errors from 1 level nested object w/ errors as a strings', () => {
    const errors = {
      email: 'Email error',
      avatar: {
        url: 'Avatar url error',
        title: 'Avatar title error',
      },
      coverPhoto: {
        url: 'Cover photo url error',
        width: 'Cover photo width error',
        height: 'Cover photo height error',
      },
    };
    const normalizedErrors = normalizeExternalErrors(errors);

    expect(normalizedErrors).toEqual([
      { fieldId: 'email', message: 'Email error' },
      { fieldId: 'avatar.url', message: 'Avatar url error' },
      { fieldId: 'avatar.title', message: 'Avatar title error' },
      { fieldId: 'coverPhoto.url', message: 'Cover photo url error' },
      { fieldId: 'coverPhoto.width', message: 'Cover photo width error' },
      { fieldId: 'coverPhoto.height', message: 'Cover photo height error' },
    ]);
  });

  it('combines array of errors from 1 level nested object w/ one of the errors as an array', () => {
    const errors = {
      email: 'Email error',
      avatar: {
        url: ['Avatar url error 1', 'Avatar url error 2'],
        title: 'Avatar title error',
      },
      coverPhoto: {
        url: 'Cover photo url error',
        width: 'Cover photo width error',
        height: 'Cover photo height error',
      },
    };
    const normalizedErrors = normalizeExternalErrors(errors);

    expect(normalizedErrors).toEqual([
      { fieldId: 'email', message: 'Email error' },
      {
        fieldId: 'avatar.url',
        message: ['Avatar url error 1', 'Avatar url error 2'],
      },
      { fieldId: 'avatar.title', message: 'Avatar title error' },
      { fieldId: 'coverPhoto.url', message: 'Cover photo url error' },
      { fieldId: 'coverPhoto.width', message: 'Cover photo width error' },
      { fieldId: 'coverPhoto.height', message: 'Cover photo height error' },
    ]);
  });

  it('combines array of errors from 2 level nested object w/ errors as a strings', () => {
    const errors = {
      email: 'Email error',
      photos: {
        private: 'Photos private error',
        avatar: {
          url: 'Photos avatar url error',
          title: 'Photos avatar title error',
        },
        coverPhoto: {
          url: 'Photos cover photo url error',
          width: 'Photos cover photo width error',
          height: 'Photos cover photo height error',
        },
      },
    };
    const normalizedErrors = normalizeExternalErrors(errors);

    expect(normalizedErrors).toEqual([
      { fieldId: 'email', message: 'Email error' },
      { fieldId: 'photos.private', message: 'Photos private error' },
      { fieldId: 'photos.avatar.url', message: 'Photos avatar url error' },
      { fieldId: 'photos.avatar.title', message: 'Photos avatar title error' },
      {
        fieldId: 'photos.coverPhoto.url',
        message: 'Photos cover photo url error',
      },
      {
        fieldId: 'photos.coverPhoto.width',
        message: 'Photos cover photo width error',
      },
      {
        fieldId: 'photos.coverPhoto.height',
        message: 'Photos cover photo height error',
      },
    ]);
  });

  it('combines array of errors from 2 level nested object w/ one of the errors as an array', () => {
    const errors = {
      email: 'Email error',
      photos: {
        private: 'Photos private error',
        avatar: {
          url: ['Photos avatar url error 1', 'Photos avatar url error 2'],
          title: 'Photos avatar title error',
        },
        coverPhoto: {
          url: 'Photos cover photo url error',
          width: 'Photos cover photo width error',
          height: 'Photos cover photo height error',
        },
      },
    };
    const normalizedErrors = normalizeExternalErrors(errors);

    expect(normalizedErrors).toEqual([
      { fieldId: 'email', message: 'Email error' },
      { fieldId: 'photos.private', message: 'Photos private error' },
      {
        fieldId: 'photos.avatar.url',
        message: ['Photos avatar url error 1', 'Photos avatar url error 2'],
      },
      { fieldId: 'photos.avatar.title', message: 'Photos avatar title error' },
      {
        fieldId: 'photos.coverPhoto.url',
        message: 'Photos cover photo url error',
      },
      {
        fieldId: 'photos.coverPhoto.width',
        message: 'Photos cover photo width error',
      },
      {
        fieldId: 'photos.coverPhoto.height',
        message: 'Photos cover photo height error',
      },
    ]);
  });

  xit(
    'combines array of errors from 1 level nested collection of errors as a strings',
    () => {},
  );
  xit(
    'combines array of errors from 1 level nested collection of errors w/ one of the errors as an array',
    () => {},
  );
});
