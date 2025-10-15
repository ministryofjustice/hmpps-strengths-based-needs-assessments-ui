import FormWizard from 'hmpo-form-wizard'
import { Options, FieldDependencyTreeBuilder } from '../../app/utils/fieldDependencyTreeBuilder'
import { isNonRenderedField } from './nunjucks.utils'
import { FieldType } from '../@types/hmpo-form-wizard/enums'
import { isPractitionerAnalysisField } from '../../app/utils/field.utils'
import sections, { Section } from '../../app/form/v1_0/config/sections'

export interface GetSummaryFieldsOptions extends Options {
  answers: FormWizard.Answers
  collectionOnly?: boolean
}

/**
 * Generates an object containing grouped summary fields based on the provided options.
 *
 * @param {Object} options - Configuration options for determining which fields to include.
 * @param {Object} sectionsConfig - Configuration for overriding the default section configuration.
 * @param {boolean} [options.collectionOnly] - Flag to include only fields of type `Collection`.
 * @param {Object} [options.answers] - Answers provided to the form, used to check which fields have values.
 * @returns {Object} - An object containing grouped fields:
 *                      - `singleFields`: Fields that are not part of a collection.
 *                      - `collectionFields`: Fields that belong to a collection.
 */
export default (options: GetSummaryFieldsOptions, sectionsConfig?: Record<string, Section>) => {
  const builder = new FieldDependencyTreeBuilder(options, options.answers, sectionsConfig ?? sections)

  const hasAnswer = (field: FormWizard.Field) => {
    const answer = builder.getAnswers(field.code)
    return Array.isArray(answer) && answer.length > 0 && answer.every(v => v !== '')
  }

  const isDisplayable = (field: FormWizard.Field) =>
    field && field.hidden !== true && (hasAnswer(field) || field.summary?.displayAlways)

  const isCollection = (field: FormWizard.Field) => field.type === FieldType.Collection

  const stepFieldsFilterFn = (field: FormWizard.Field) =>
    options.collectionOnly
      ? isCollection(field)
      : !isNonRenderedField(field.id) && !isPractitionerAnalysisField(field.id) && isDisplayable(field)

  const allFields = builder.setStepFieldsFilterFn(stepFieldsFilterFn).getAllFieldsInSectionFromSteps()

  // append collection fields at the end of the array
  return {
    singleFields: allFields.filter(f => !f.field.collection),
    collectionFields: allFields.filter(f => f.field.collection),
  }
}
