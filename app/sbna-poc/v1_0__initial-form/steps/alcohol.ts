import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from '../controllers/saveAndContinueController'

const defaultTitle = 'Alcohol use'
const sectionName = 'alcohol-use'

const baseAlcoholUsageFields = [
  'alcohol_past_issues',
  'alcohol_past_issues_details',
  'alcohol_reasons_for_use',
  'alcohol_reasons_for_use_other_details',
  'alcohol_impact_of_use',
  'alcohol_impact_of_use_other_details',
  'alcohol_stopped_or_reduced',
  'alcohol_stopped_or_reduced_details',
  'alcohol_changes',
  'alcohol_made_changes_details',
  'alcohol_making_changes_details',
  'alcohol_want_to_make_changes_details',
  'alcohol_needs_help_to_make_changes_details',
  'alcohol_thinking_about_making_changes_details',
  'alcohol_does_not_want_to_make_changes_details',
  'alcohol_use_section_complete',
  'alcohol_use_analysis_section_complete',
]

const practitionerAnalysisFields = [
  'alcohol_practitioner_analysis_patterns_of_behaviour',
  'alcohol_practitioner_analysis_patterns_of_behaviour_details',
  'alcohol_practitioner_analysis_strengths_or_protective_factors',
  'alcohol_practitioner_analysis_strengths_or_protective_factors_details',
  'alcohol_practitioner_analysis_risk_of_serious_harm',
  'alcohol_practitioner_analysis_risk_of_serious_harm_details',
  'alcohol_practitioner_analysis_risk_of_reoffending',
  'alcohol_practitioner_analysis_risk_of_reoffending_details',
  'alcohol_practitioner_analysis_related_to_risk',
  'alcohol_practitioner_analysis_related_to_risk_details',
  'alcohol_use_analysis_section_complete',
]

const stepOptions: FormWizard.Steps = {
  '/alcohol-use': {
    pageTitle: defaultTitle,
    fields: ['alcohol_use', 'alcohol_use_section_complete', 'alcohol_use_analysis_section_complete'],
    next: [
      { field: 'alcohol_use', value: 'YES_WITHIN_LAST_THREE_MONTHS', next: 'alcohol-usage-last-three-months' },
      { field: 'alcohol_use', value: 'YES_NOT_IN_LAST_THREE_MONTHS', next: 'alcohol-usage-but-not-last-three-months' },
      { field: 'alcohol_use', value: 'NO', next: 'alcohol-analysis' },
    ],
    navigationOrder: 5,
    section: sectionName,
    sectionProgressRules: [
      {
        fieldCode: 'alcohol_use_section_complete',
        conditionFn: (isValid: boolean, answers: Record<string, string | string[]>) =>
          isValid && answers.alcohol_use === 'NO' ? 'YES' : 'NO',
      },
      { fieldCode: 'alcohol_use_analysis_section_complete', conditionFn: () => 'NO' },
    ],
  },
  '/alcohol-usage-last-three-months': {
    pageTitle: defaultTitle,
    fields: [
      'alcohol_frequency',
      'alcohol_units',
      'alcohol_binge_drinking',
      'alcohol_binge_drinking_frequency',
      'alcohol_evidence_of_excess_drinking',
      ...baseAlcoholUsageFields,
    ],
    backLink: sectionName,
    next: ['alcohol-analysis'],
    section: sectionName,
    sectionProgressRules: [
      { fieldCode: 'alcohol_use_section_complete', conditionFn: () => 'YES' },
      { fieldCode: 'alcohol_use_analysis_section_complete', conditionFn: () => 'NO' },
    ],
  },
  '/alcohol-usage-but-not-last-three-months': {
    pageTitle: defaultTitle,
    fields: baseAlcoholUsageFields,
    backLink: sectionName,
    next: ['alcohol-analysis'],
    section: sectionName,
    sectionProgressRules: [
      { fieldCode: 'alcohol_use_section_complete', conditionFn: () => 'YES' },
      { fieldCode: 'alcohol_use_analysis_section_complete', conditionFn: () => 'NO' },
    ],
  },
  '/alcohol-analysis': {
    pageTitle: defaultTitle,
    controller: SaveAndContinueController,
    fields: practitionerAnalysisFields,
    next: ['alcohol-analysis-complete'],
    template: 'forms/sbna-poc/alcohol-summary-analysis',
    section: sectionName,
    sectionProgressRules: [
      {
        fieldCode: 'alcohol_use_analysis_section_complete',
        conditionFn: (isValidated: boolean) => (isValidated ? 'YES' : 'NO'),
      },
    ],
  },
  '/alcohol-analysis-complete': {
    pageTitle: defaultTitle,
    controller: SaveAndContinueController,
    fields: practitionerAnalysisFields,
    next: [],
    template: 'forms/sbna-poc/alcohol-summary-analysis-complete',
    section: sectionName,
    sectionProgressRules: [],
  },
}

export default stepOptions
