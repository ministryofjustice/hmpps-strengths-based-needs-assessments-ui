import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import { getMediumLabelClassFor, toFormWizardFields, yesNoOptions } from './common'
import { createPractitionerAnalysisFieldsWith } from './common/practitionerAnalysisFields'


export const offenceAnalysisFields: Array<FormWizard.Field> = [
  
    
  
      
]


export const practitionerAnalysisFields: Array<FormWizard.Field> = createPractitionerAnalysisFieldsWith(
  '',
)

export const questionSectionComplete: FormWizard.Field = {
  text: 'Is the offence analysis section complete?',
  code: 'offence_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const analysisSectionComplete: FormWizard.Field = {
  text: 'Is the thinking behaviours and attitude section complete?',
  code: 'offence_analysis_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const sectionCompleteFields: Array<FormWizard.Field> = [questionSectionComplete, analysisSectionComplete]

export default [
  practitionerAnalysisFields,
  sectionCompleteFields,
  analysisSectionComplete,
  questionSectionComplete,
  offenceAnalysisFields,
]
  .flat()
  .reduce(toFormWizardFields, {})
