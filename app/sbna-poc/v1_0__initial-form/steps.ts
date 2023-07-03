import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from '../../common/controllers/saveAndContinue'

const steps: FormWizard.Steps = {
  '/start': {
    pageTitle: 'POC Form',
    reset: true,
    entryPoint: true,
    template: `forms/sbna-poc/start`,
    next: 'accommodation',
  },
  '/accommodation': {
    pageTitle: 'Accommodation',
    controller: SaveAndContinueController,
    fields: ['current_accommodation', 'settled_details'],
    next: 'employment-education-finance',
    template: 'forms/default',
    navigationOrder: 1,
  },
  '/employment-education-finance': {
    pageTitle: 'Employment, education and finance',
    controller: SaveAndContinueController,
    fields: ['test_date_field'],
    template: 'forms/default',
    navigationOrder: 2,
  },
}

export default steps
