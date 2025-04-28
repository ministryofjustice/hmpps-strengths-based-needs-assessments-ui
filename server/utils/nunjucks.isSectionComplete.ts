import FormWizard from 'hmpo-form-wizard'
import { FieldDependencyTreeBuilder } from '../../app/utils/fieldDependencyTreeBuilder'

export default function isSectionComplete(options: FormWizard.FormOptions, answers: FormWizard.Answers) {
  const { isSectionComplete } = new FieldDependencyTreeBuilder({...options, section: options.section}, answers).getPageNavigation()
  return isSectionComplete
}
