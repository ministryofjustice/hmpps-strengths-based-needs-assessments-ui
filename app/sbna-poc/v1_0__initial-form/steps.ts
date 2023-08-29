import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from './controllers/saveAndContinueController'
import StartController from './controllers/startController'

const steps: FormWizard.Steps = {
  '/start': {
    pageTitle: 'POC Form',
    controller: StartController,
    reset: true,
    entryPoint: true,
    template: `forms/sbna-poc/start`,
    next: 'accommodation',
  },
  '/accommodation': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    fields: ['current_accommodation'],
    next: [
      { field: 'current_accommodation', value: 'SETTLED', next: 'settled-accommodation' },
      { field: 'current_accommodation', value: 'TEMPORARY', next: 'temporary-accommodation' },
      { field: 'current_accommodation', value: 'NO_ACCOMMODATION', next: 'no-accommodation' },
    ],
    template: 'forms/default',
    navigationOrder: 1,
  },
  '/settled-accommodation': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    fields: [
      'living_with',
      'suitable_housing_location',
      'suitable_housing',
      'accommodation_changes',
      'accommodation_changes_details',
    ],
    next: 'accommodation-summary-analysis-settled',
    template: 'forms/default',
  },
  '/temporary-accommodation': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    fields: [
      'living_with',
      'suitable_housing_location',
      'suitable_housing',
      'accommodation_changes',
      'accommodation_changes_details',
    ],
    next: 'accommodation-summary-analysis-temporary',
    template: 'forms/default',
  },
  '/no-accommodation': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    fields: [
      'no_accommodation_details',
      'suitable_housing_details',
      'suitable_housing_planned',
      'accommodation_changes',
      'accommodation_changes_details',
    ],
    next: 'accommodation-summary-analysis-no-accommodation',
    template: 'forms/default',
  },
  '/employment-education-finance': {
    pageTitle: 'Employment, education and finance',
    controller: SaveAndContinueController,
    fields: [],
    template: 'forms/default',
    navigationOrder: 2,
  },
  '/accommodation-summary-analysis-no-accommodation': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    fields: ['accommodation_practitioner_analysis', 'accommodation_serious_harm', 'accommodation_risk_of_reoffending'],
    next: 'accommodation-analysis-complete-no-accommodation',
    template: 'forms/sbna-poc/accommodation-summary-analysis-no-accommodation',
  },
  '/accommodation-summary-analysis-temporary': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    fields: ['accommodation_practitioner_analysis', 'accommodation_serious_harm', 'accommodation_risk_of_reoffending'],
    next: 'accommodation-analysis-complete-temporary',
    template: 'forms/sbna-poc/accommodation-summary-analysis-temporary',
  },
  '/accommodation-summary-analysis-settled': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    fields: ['accommodation_practitioner_analysis', 'accommodation_serious_harm', 'accommodation_risk_of_reoffending'],
    next: 'accommodation-analysis-complete-settled',
    template: 'forms/sbna-poc/accommodation-summary-analysis-settled',
  },
  '/accommodation-analysis-complete-settled': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    next: 'employment-education-finance',
    template: 'forms/sbna-poc/accommodation-analysis-complete-settled',
  },
  '/accommodation-analysis-complete-temporary': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    next: 'employment-education-finance',
    template: 'forms/sbna-poc/accommodation-analysis-complete-temporary',
  },
  '/accommodation-analysis-complete-no-accommodation': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    next: 'employment-education-finance',
    template: 'forms/sbna-poc/accommodation-analysis-complete-no-accommodation',
  },
}

export default steps
