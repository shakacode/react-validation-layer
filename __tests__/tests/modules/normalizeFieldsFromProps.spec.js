/* @flow */
/* eslint-disable max-len */

import { fromJS } from 'immutable';

import { dummyFunction } from '../../helpers';
import normalizeFieldsFromProps from '../../../src/modules/normalizeFieldsFromProps';


describe('modules.normalizeFieldsFromProps()', () => {
  it('combines correct array of flat fields', () => {
    const fields = {
      username: true,
      email: { validate: dummyFunction },
      password: { validate: dummyFunction },
    };

    const data = {
      username: 'alex',
      email: 'some@email.com',
      password: undefined,
    };

    const normalizedFields = normalizeFieldsFromProps(fields, data);

    const expected = [
      { id: 'username', keyPath: ['username'] },
      { id: 'email', keyPath: ['email'], validate: dummyFunction },
      { id: 'password', keyPath: ['password'], validate: dummyFunction },
    ];

    expect(normalizedFields).toEqual(expected);
  });


  it('combines correct array of 1 level nested fields', () => {
    const fields = {
      username: true,
      email: { validate: dummyFunction },
      avatar: {
        url: { validate: dummyFunction },
        title: true,
      },
      coverPhoto: {
        url: { validate: dummyFunction },
        width: { transformBeforeStore: dummyFunction },
        height: { transformBeforeStore: dummyFunction },
      },
    };

    const data = {
      username: 'alex',
      email: 'some@email.com',
      avatar: {
        url: 'http://avatar.png',
        title: undefined,
      },
      coverPhoto: {
        url: 'http://cover-photo.png',
        width: 1000,
        height: 300,
      },
    };

    const normalizedFields = normalizeFieldsFromProps(fields, data);

    const expected = [
      { id: 'username', keyPath: ['username'] },
      { id: 'email', keyPath: ['email'], validate: dummyFunction },
      { id: 'avatar.url', keyPath: ['avatar', 'url'], validate: dummyFunction },
      { id: 'avatar.title', keyPath: ['avatar', 'title'] },
      { id: 'coverPhoto.url', keyPath: ['coverPhoto', 'url'], validate: dummyFunction },
      { id: 'coverPhoto.width', keyPath: ['coverPhoto', 'width'], transformBeforeStore: dummyFunction },
      { id: 'coverPhoto.height', keyPath: ['coverPhoto', 'height'], transformBeforeStore: dummyFunction },
    ];

    expect(normalizedFields).toEqual(expected);
  });


  it('combines correct array of 2 level nested fields', () => {
    const fields = {
      username: true,
      email: { validate: dummyFunction },
      photos: {
        private: true,
        avatar: {
          url: { validate: dummyFunction },
          title: true,
        },
        coverPhoto: {
          url: { validate: dummyFunction },
          width: { transformBeforeStore: dummyFunction },
          height: { transformBeforeStore: dummyFunction },
        },
      },
    };

    const data = {
      username: 'alex',
      email: 'some@email.com',
      photos: {
        private: true,
        avatar: {
          url: 'http://avatar.png',
          title: undefined,
        },
        coverPhoto: {
          url: 'http://cover-photo.png',
          width: 1000,
          height: 300,
        },
      },
    };

    const normalizedFields = normalizeFieldsFromProps(fields, data);

    const expected = [
      { id: 'username', keyPath: ['username'] },
      { id: 'email', keyPath: ['email'], validate: dummyFunction },
      { id: 'photos.private', keyPath: ['photos', 'private'] },
      { id: 'photos.avatar.url', keyPath: ['photos', 'avatar', 'url'], validate: dummyFunction },
      { id: 'photos.avatar.title', keyPath: ['photos', 'avatar', 'title'] },
      { id: 'photos.coverPhoto.url', keyPath: ['photos', 'coverPhoto', 'url'], validate: dummyFunction },
      { id: 'photos.coverPhoto.width', keyPath: ['photos', 'coverPhoto', 'width'], transformBeforeStore: dummyFunction },
      { id: 'photos.coverPhoto.height', keyPath: ['photos', 'coverPhoto', 'height'], transformBeforeStore: dummyFunction },
    ];

    expect(normalizedFields).toEqual(expected);
  });


  it('combines correct array of 2 level nested fields with immutable data', () => {
    const fields = {
      username: true,
      email: { validate: dummyFunction },
      photos: {
        private: true,
        avatar: {
          url: { validate: dummyFunction },
          title: true,
        },
        coverPhoto: {
          url: { validate: dummyFunction },
          width: { transformBeforeStore: dummyFunction },
          height: { transformBeforeStore: dummyFunction },
        },
      },
    };

    const data = fromJS({
      username: 'alex',
      email: 'some@email.com',
      photos: {
        private: true,
        avatar: {
          url: 'http://avatar.png',
          title: undefined,
        },
        coverPhoto: {
          url: 'http://cover-photo.png',
          width: 1000,
          height: 300,
        },
      },
    });

    const normalizedFields = normalizeFieldsFromProps(fields, data);

    const expected = [
      { id: 'username', keyPath: ['username'] },
      { id: 'email', keyPath: ['email'], validate: dummyFunction },
      { id: 'photos.private', keyPath: ['photos', 'private'] },
      { id: 'photos.avatar.url', keyPath: ['photos', 'avatar', 'url'], validate: dummyFunction },
      { id: 'photos.avatar.title', keyPath: ['photos', 'avatar', 'title'] },
      { id: 'photos.coverPhoto.url', keyPath: ['photos', 'coverPhoto', 'url'], validate: dummyFunction },
      { id: 'photos.coverPhoto.width', keyPath: ['photos', 'coverPhoto', 'width'], transformBeforeStore: dummyFunction },
      { id: 'photos.coverPhoto.height', keyPath: ['photos', 'coverPhoto', 'height'], transformBeforeStore: dummyFunction },
    ];

    expect(normalizedFields).toEqual(expected);
  });


  xit('combines correct array of 1 level nested collection of fields', () => {});
});
