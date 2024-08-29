import FormWizard from 'hmpo-form-wizard'
import { FieldDependencyTreeBuilder } from '../../app/utils/fieldDependencyTreeBuilder'
import { isNonRenderedField, isPractitionerAnalysisField } from './nunjucks.utils'
import { FieldType } from '../@types/hmpo-form-wizard/enums'

export default (options: FormWizard.FormOptions, answers: FormWizard.Answers, collectionOnly: boolean = false) => {
  const builder = new FieldDependencyTreeBuilder(options, answers)

  const hasAnswer = (field: FormWizard.Field) => {
    const answer = builder.getAnswers(field.code)
    return Array.isArray(answer) && answer.length > 0 && answer.every(v => v !== '')
  }

  const isDisplayable = (field: FormWizard.Field) =>
    field && field.hidden !== true && (hasAnswer(field) || field.summary?.displayAlways)

  const isCollection = (field: FormWizard.Field) => field.type === FieldType.Collection

  const stepFieldsFilterFn = (field: FormWizard.Field) =>
    collectionOnly
      ? isCollection(field)
      : !isNonRenderedField(field.id) && !isPractitionerAnalysisField(field.id) && isDisplayable(field)

  return builder.setStepFieldsFilterFn(stepFieldsFilterFn).build()
}
