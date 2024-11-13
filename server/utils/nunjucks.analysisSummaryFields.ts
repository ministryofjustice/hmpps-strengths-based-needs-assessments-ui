import FormWizard from 'hmpo-form-wizard'
import { FieldDependencyTreeBuilder } from '../../app/utils/fieldDependencyTreeBuilder'
import { isNonRenderedField } from './nunjucks.utils'
import { isPractitionerAnalysisField } from '../../app/utils/field.utils'

export interface GetSummaryFieldsOptions {
  section: string
  allFields: Record<string, FormWizard.Field>
  steps: FormWizard.RenderedSteps
  answers: FormWizard.Answers
  collectionOnly?: boolean
}

export default (options: GetSummaryFieldsOptions) => {
  const builder = new FieldDependencyTreeBuilder(options, options.answers)

  const hasAnswer = (field: FormWizard.Field) => {
    const answer = builder.getAnswers(field.code)
    return Array.isArray(answer) && answer.length > 0 && answer.every(v => v !== '')
  }

  const isDisplayable = (field: FormWizard.Field) =>
    field && field.hidden !== true && (hasAnswer(field) || field.summary?.displayAlways)

  const stepFieldsFilterFn = (field: FormWizard.Field) =>
    !isNonRenderedField(field.id) && isPractitionerAnalysisField(field.id) && isDisplayable(field)

  const allFields = builder.setStepFieldsFilterFn(stepFieldsFilterFn).build()

  return {
    singleFields: allFields.filter(f => !f.field.collection),
    collectionFields: [] as FormWizard.Field[],
  }
}
