import FormWizard from 'hmpo-form-wizard'
import { FieldDependencyTreeBuilder } from '../../app/utils/fieldDependencyTreeBuilder'
import { isNonRenderedField, isPractitionerAnalysisField } from './nunjucks.utils'

export default (options: FormWizard.FormOptions, answers: FormWizard.Answers) => {
  const builder = new FieldDependencyTreeBuilder(options, answers)

  const hasAnswer = (field: FormWizard.Field) => {
    const answer = builder.getAnswers(field.code)
    return Array.isArray(answer) && answer.length > 0 && answer.every(v => v !== '')
  }

  const isDisplayable = (field: FormWizard.Field) =>
    field && field.hidden !== true && (hasAnswer(field) || field.summary?.displayAlways)

  const stepFieldsFilterFn = (field: FormWizard.Field) =>
    !isNonRenderedField(field.id) && !isPractitionerAnalysisField(field.id) && isDisplayable(field)

  return builder.setStepFieldsFilterFn(stepFieldsFilterFn).build()
}
