import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from '../controllers/saveAndContinueController'
import StartController from '../controllers/startController'
import accommodationSteps from './accommodation'
import financeSteps from './finance'
import drugsSteps from './drugs'
import alcoholSteps from './alcohol'
import employmentEducationSteps from './employment-education'
import healthAndWellbeingSteps from './health-wellbeing'
import thinkingBehavioursAttitudeSteps from './thinking-behaviour-attitudes'
import personalRelationshipsAndCommunitySteps from './personal-relationships-community'
import offenceAnalysisSteps from './offence-analysis'
import { assessmentComplete } from '../fields'

const stepOptions: FormWizard.Steps = {
  '/start': {
    pageTitle: 'POC Form',
    controller: StartController,
    reset: true,
    entryPoint: true,
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
  ...offenceAnalysisSteps,
}

const addStep = (options: FormWizard.Step & { path: string }, steps: FormWizard.Steps): FormWizard.Steps => ({
  ...steps,
  [options.path]: {
    ...options,
    pageTitle: options.pageTitle,
    controller: options.controller || SaveAndContinueController,
    fields: [assessmentComplete.code, ...(options.fields || [])],
    template: options.template || 'forms/default',
    backLink: options.backLink || null, // override FormWizard behaviour to provide a generated backlink, these will be set manually in config
  },
})

const steps: FormWizard.Steps = Object.entries(stepOptions).reduce(
  (allSteps: FormWizard.Steps, [path, step]: [string, FormWizard.Step]) => addStep({ path, ...step }, allSteps),
  {},
)

export default steps
