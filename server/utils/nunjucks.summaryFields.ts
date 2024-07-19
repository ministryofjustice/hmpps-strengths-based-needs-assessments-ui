import FormWizard from 'hmpo-form-wizard'
import { FieldDependencyTreeBuilder } from '../../app/utils/fieldDependencyTreeBuilder'

export default (options: FormWizard.FormOptions, answers: FormWizard.Answers) => {
  return new FieldDependencyTreeBuilder(
    options,
    answers,
    {
      isRendered: true,
      isPractitionerAnalysis: false,
      isDisplayable: true
    }
  ).build().fields
}
