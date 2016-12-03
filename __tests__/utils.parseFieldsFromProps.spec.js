/* eslint-disable max-len */

import { fromJS } from 'immutable';

import { dummyFunction } from './helpers';

import * as utils from '../src/utils';


describe('utils.parseFieldsFromProps()', () => {
  it('combines correct array of flat fields', () => {
    const propsFields = {
      username: true,
      email: { validate: dummyFunction },
      password: { validate: dummyFunction },
    };

    const data = {
      username: 'alex',
      email: 'some@email.com',
      password: undefined,
    };

    const expectedParsedFields = [
      { keyPath: ['username'], name: 'username' },
      { keyPath: ['email'], name: 'email', validate: dummyFunction },
      { keyPath: ['password'], name: 'password', validate: dummyFunction },
    ];

    const actualParsedFields = utils.parseFieldsFromProps(propsFields, data);

    expect(actualParsedFields).toEqual(expectedParsedFields);
  });


  it('combines correct array of 1 level nested fields', () => {
    const propsFields = {
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

    const expectedParsedFields = [
      { keyPath: ['username'], name: 'username' },
      { keyPath: ['email'], name: 'email', validate: dummyFunction },
      { keyPath: ['avatar', 'url'], name: 'url', validate: dummyFunction },
      { keyPath: ['avatar', 'title'], name: 'title' },
      { keyPath: ['coverPhoto', 'url'], name: 'url', validate: dummyFunction },
      { keyPath: ['coverPhoto', 'width'], name: 'width', transformBeforeStore: dummyFunction },
      { keyPath: ['coverPhoto', 'height'], name: 'height', transformBeforeStore: dummyFunction },
    ];

    const actualParsedFields = utils.parseFieldsFromProps(propsFields, data);

    expect(actualParsedFields).toEqual(expectedParsedFields);
  });


  it('combines correct array of 2 level nested fields', () => {
    const propsFields = {
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

    const expectedParsedFields = [
      { keyPath: ['username'], name: 'username' },
      { keyPath: ['email'], name: 'email', validate: dummyFunction },
      { keyPath: ['photos', 'private'], name: 'private' },
      { keyPath: ['photos', 'avatar', 'url'], name: 'url', validate: dummyFunction },
      { keyPath: ['photos', 'avatar', 'title'], name: 'title' },
      { keyPath: ['photos', 'coverPhoto', 'url'], name: 'url', validate: dummyFunction },
      { keyPath: ['photos', 'coverPhoto', 'width'], name: 'width', transformBeforeStore: dummyFunction },
      { keyPath: ['photos', 'coverPhoto', 'height'], name: 'height', transformBeforeStore: dummyFunction },
    ];

    const actualParsedFields = utils.parseFieldsFromProps(propsFields, data);

    expect(actualParsedFields).toEqual(expectedParsedFields);
  });


  it('combines correct array of 2 level nested fields with immutable data', () => {
    const propsFields = {
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

    const expectedParsedFields = [
      { keyPath: ['username'], name: 'username' },
      { keyPath: ['email'], name: 'email', validate: dummyFunction },
      { keyPath: ['photos', 'private'], name: 'private' },
      { keyPath: ['photos', 'avatar', 'url'], name: 'url', validate: dummyFunction },
      { keyPath: ['photos', 'avatar', 'title'], name: 'title' },
      { keyPath: ['photos', 'coverPhoto', 'url'], name: 'url', validate: dummyFunction },
      { keyPath: ['photos', 'coverPhoto', 'width'], name: 'width', transformBeforeStore: dummyFunction },
      { keyPath: ['photos', 'coverPhoto', 'height'], name: 'height', transformBeforeStore: dummyFunction },
    ];

    const actualParsedFields = utils.parseFieldsFromProps(propsFields, data);

    expect(actualParsedFields).toEqual(expectedParsedFields);
  });


  xit('combines correct array of 1 level nested collection of fields', () => {});
});
