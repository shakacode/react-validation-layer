/* @flow */

import type {
  LayerId,
  FieldId,
  FieldFlags,
  NormalizedField,
  NormalizedFields,
} from '../types';

import buildErrorMessage from '../modules/buildErrorMessage';

/**
 * @desc This container encapsulates non-exposable state
 *       and provides API to manage its data.
 *       For now it holds only internal data,
 *       that don't cause children's re-render on updates.
 *       Most likely it will be extended to hold whole state.
 *       Thus it will be possible to use vanilla react component
 *       and external container (e.g. Redux) as a state holder.
 *
 */
export default class StateContainer {

  id: LayerId;

  normalizedFields: NormalizedFields = [];

  touchedFields: FieldFlags = {};
  bluredFields: FieldFlags = {};
  emittedFields: FieldFlags = {};

  isSubmitting: boolean = false;
  formWasSubmitted: boolean = false;


  constructor(layerId: LayerId): void {
    this.id = layerId;
  }

  getLayerId = (): LayerId => this.id;

  getNormalizedFields = (): NormalizedFields => this.normalizedFields;

  getNormalizedField = (fieldId: FieldId): NormalizedField => {
    const normalizedField = this.normalizedFields.find(field => field.id === fieldId);

    if (!normalizedField) {
      const layerId = this.getLayerId();

      throw new Error(buildErrorMessage({
        layerId,
        fieldId,
        message: [
          `Can't find \`field\` at key path: ${fieldId}`,
          'Make sure it exists and has truthy value (e.g. object with options or just `true`).',
        ],
      }));
    }

    return normalizedField;
  }

  setNormalizedFields = (normalizedFields: NormalizedFields): void => {
    this.normalizedFields = normalizedFields;
  };


  getTouchedField = (fieldId: FieldId): ?boolean => this.touchedFields[fieldId];

  setTouchedField = (fieldId: FieldId): void => {
    if (!this.touchedFields[fieldId]) {
      this.touchedFields[fieldId] = true;
    }
  };

  setAllFieldsTouched = (): void => {
    this.touchedFields =
      this
        .normalizedFields
        .map(field => field.id)
        .reduce((fields, fieldId) => ({
          ...fields,
          [fieldId]: true,
        }), {});
  };


  getBluredField = (fieldId: FieldId): ?boolean => this.bluredFields[fieldId];

  setBluredField = (fieldId: FieldId): void => {
    if (!this.bluredFields[fieldId]) {
      this.bluredFields[fieldId] = true;
    }
    this.setTouchedField(fieldId);
  };


  getEmittedField = (fieldId: FieldId): ?boolean => this.emittedFields[fieldId];

  setEmittedField = (fieldId: FieldId): void => {
    if (!this.emittedFields[fieldId]) {
      this.emittedFields[fieldId] = true;
    }
  };


  getIsSubmitting = (): boolean => this.isSubmitting;

  setIsSubmitting = (isSubmitting: boolean): void => {
    this.isSubmitting = isSubmitting;
  };


  getFormWasSubmitted = (): boolean => this.formWasSubmitted;

  setFormWasSubmitted = (): void => {
    if (!this.formWasSubmitted) {
      this.formWasSubmitted = true;
    }
  };


  resetState = (normalizedFields: NormalizedFields): void => {
    this.normalizedFields = normalizedFields;

    this.touchedFields = {};
    this.bluredFields = {};
    this.emittedFields = {};

    this.isSubmitting = false;
    this.formWasSubmitted = false;
  };
}
