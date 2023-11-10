import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from '../controllers/saveAndContinueController'
import StartController from '../controllers/startController'
import accommodationSteps from './accommodation'
import financeSteps from './finance'
import drugsSteps from './drugs'
import alcoholSteps from './alcohol'

const stepOptions: FormWizard.Steps = {
  '/start': {
    pageTitle: 'POC Form',
    controller: StartController,
    reset: true,
    entryPoint: true,
    template: `forms/sbna-poc/start`,
    next: 'accommodation',
    section: 'none',
  },
  '/employment-education-finance': {
    pageTitle: 'Employment and education ',
    controller: SaveAndContinueController,
    fields: [],
    template: 'forms/default',
    navigationOrder: 2,
    section: 'employment-education-finance',
  },
  ...accommodationSteps,
  ...financeSteps,
  ...drugsSteps,
  ...alcoholSteps,
}

const addStep = (options: FormWizard.Step & { path: string }, steps: FormWizard.Steps): FormWizard.Steps => ({
  ...steps,
  [options.path]: {
    ...options,
    pageTitle: options.pageTitle,
    controller: options.controller || SaveAndContinueController,
    fields: options.fields || [],
    template: options.template || 'forms/default',
    backLink: options.backLink || null, // override FormWizard behaviour to provide a generated backlink, these will be set manually in config
  },
})

const steps: FormWizard.Steps = Object.entries(stepOptions).reduce(
  (allSteps: FormWizard.Steps, [path, step]: [string, FormWizard.Step]) => addStep({ path, ...step }, allSteps),
  {},
)

export default steps
