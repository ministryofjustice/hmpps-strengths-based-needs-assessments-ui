import FormWizard from 'hmpo-form-wizard'
import BaseController from '../../common/controllers/base-controller'

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
    template: `forms/sbna-poc/accommodation`,
    controller: BaseController,
    fields: ['current_accommodation'],
    next: 'employment-education-finance',
  },
  '/employment-education-finance': {
    pageTitle: 'Employment, education and finance',
    template: `forms/sbna-poc/employment-education-and-finance`,
  },
}

export default steps
