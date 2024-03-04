import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from '../controllers/saveAndContinueController'
import StartController from '../controllers/startController'
import LandingPageController from '../controllers/landingPageController'
import accommodationSteps from './accommodation'
import financeSteps from './finance'
import drugsSteps from './drugs'
import alcoholSteps from './alcohol'
import employmentEducationSteps from './employment-education'
import healthAndWellbeingSteps from './health-wellbeing'
import thinkingBehavioursAttitudeSteps from './thinking-behaviour-attitudes'
import personalRelationshipsAndCommunitySteps from './personal-relationships-community'

const stepOptions: FormWizard.Steps = {
  '/start': {
    pageTitle: 'POC Form',
    controller: StartController,
    reset: true,
    entryPoint: true,
    template: `forms/sbna-poc/start`,
    next: 'landing-page',
    section: 'none',
  },
  '/landing-page': {
    pageTitle: 'OAStub',
    controller: LandingPageController,
    template: `forms/sbna-poc/landing-page`,
    next: 'accommodation?action=resume',
    section: 'none',
  },
  '/data-mapping': {
    pageTitle: 'OASys Data Mapping',
    section: 'none',
    template: `forms/sbna-poc/data-mapping`,
  },
  ...accommodationSteps,
  ...employmentEducationSteps,
  ...financeSteps,
  ...drugsSteps,
  ...alcoholSteps,
  ...healthAndWellbeingSteps,
  ...thinkingBehavioursAttitudeSteps,
  ...personalRelationshipsAndCommunitySteps,
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
