import FormWizard from 'hmpo-form-wizard'
import { FieldDependencyTreeBuilder } from '../../app/utils/fieldDependencyTreeBuilder'
import { isNonRenderedField, isPractitionerAnalysisField } from './nunjucks.utils'

export default (options: FormWizard.FormOptions, answers: FormWizard.Answers) => {
  const builder = new FieldDependencyTreeBuilder(options, answers)

  const isDisplayable = (field: FormWizard.Field) =>
    field && (builder.getAnswers(field.code) !== undefined || field.summary?.displayAlways)

  const stepFieldsFilterFn = (field: FormWizard.Field) =>
    !isNonRenderedField(field.id) && !isPractitionerAnalysisField(field.id) && isDisplayable(field)

  return builder.setStepFieldsFilterFn(stepFieldsFilterFn).build()
}
