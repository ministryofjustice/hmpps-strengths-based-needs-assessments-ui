import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from '../controllers/saveAndContinueController'
import { drugUsageDetailsFields } from '../fields/drugs'

const stepOptions: FormWizard.Steps = {
  '/drug-use': {
    pageTitle: 'Drug use',
    controller: SaveAndContinueController,
    fields: ['drug_use', 'drug_use_section_complete', 'drug_use_analysis_section_complete'],
    next: [
      { field: 'drug_use', value: 'YES', next: 'drug-use-details' },
      { field: 'drug_use', value: 'NO', next: 'drug-use-analysis' },
    ],
    template: 'forms/default',
    navigationOrder: 4,
    section: 'drug-use',
    sectionProgressRules: [
      {
        fieldCode: 'drug_use_section_complete',
        conditionFn: (isValid: boolean, answers: Record<string, string | string[]>) =>
          isValid && answers.drug_use === 'NO' ? 'YES' : 'NO',
      },
      { fieldCode: 'drug_use_analysis_section_complete', conditionFn: () => 'NO' },
    ],
  },
  '/drug-use-details': {
    pageTitle: 'Drug use',
    controller: SaveAndContinueController,
    fields: [
      'drug_use_reasons',
      'drug_use_reason_details',
      'drug_use_impact',
      'drug_use_impact_details',
      'reducing_or_stopping_drug_use',
      'reducing_or_stopping_drug_use_details',
      'motivated_stopping_drug_use',
      'drug_use_changes',
      'drug_use_positive_change',
      'drug_use_active_change',
      'drug_use_known_change',
      'drug_use_help_change',
      'drug_use_think_change',
      'drug_use_no_change',
      'drug_use_section_complete',
      'drug_use_analysis_section_complete',
    ],
    next: 'drug-use-type',
    template: 'forms/default',
    backLink: 'drug-use',
    section: 'drug-use',
    sectionProgressRules: [
      { fieldCode: 'drug_use_section_complete', conditionFn: () => 'NO' },
      { fieldCode: 'drug_use_analysis_section_complete', conditionFn: () => 'NO' },
    ],
  },
  '/drug-use-type': {
    pageTitle: 'Drug use',
    controller: SaveAndContinueController,
    fields: ['drug_use_type', 'other_drug_details', 'drug_use_section_complete', 'drug_use_analysis_section_complete'],
    next: 'drug-usage-details',
    template: 'forms/default',
    backLink: 'drug-use-details',
    section: 'drug-use',
    sectionProgressRules: [
      { fieldCode: 'drug_use_section_complete', conditionFn: () => 'NO' },
      { fieldCode: 'drug_use_analysis_section_complete', conditionFn: () => 'NO' },
    ],
  },
  '/drug-usage-details': {
    pageTitle: 'Usage details',
    controller: SaveAndContinueController,
    fields: [...Object.keys(drugUsageDetailsFields), 'drug_use_section_complete', 'drug_use_analysis_section_complete'],
    next: 'drug-use-analysis',
    template: 'forms/sbna-poc/drug-usage',
    backLink: 'drug-use-type',
    section: 'drug-use',
    sectionProgressRules: [
      { fieldCode: 'drug_use_section_complete', conditionFn: () => 'YES' },
      { fieldCode: 'drug_use_analysis_section_complete', conditionFn: () => 'NO' },
    ],
  },
  '/drug-use-analysis': {
    pageTitle: 'Drug use',
    controller: SaveAndContinueController,
    fields: [
      'drugs_practitioner_analysis_patterns_of_behaviour',
      'drugs_practitioner_analysis_patterns_of_behaviour_details',
      'drugs_practitioner_analysis_strengths_or_protective_factors',
      'drugs_practitioner_analysis_strengths_or_protective_factors_details',
      'drugs_practitioner_analysis_risk_of_serious_harm',
      'drugs_practitioner_analysis_risk_of_serious_harm_details',
      'drugs_practitioner_analysis_risk_of_reoffending',
      'drugs_practitioner_analysis_risk_of_reoffending_details',
      'drugs_practitioner_analysis_related_to_risk',
      'drugs_practitioner_analysis_related_to_risk_details',
      'drug_use_analysis_section_complete',
    ],
    next: 'drug-use-analysis-complete#practitioner-analysis',
    template: 'forms/sbna-poc/drugs-summary-analysis',
    section: 'drug-use',
    sectionProgressRules: [{ fieldCode: 'drug_use_analysis_section_complete', conditionFn: () => 'YES' }],
  },
  '/drug-use-analysis-complete': {
    pageTitle: 'Drug use',
    controller: SaveAndContinueController,
    fields: [],
    template: 'forms/sbna-poc/drugs-summary-analysis-complete',
    section: 'drug-use',
  },
}

export default stepOptions
