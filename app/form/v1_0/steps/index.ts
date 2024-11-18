import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from '../../../controllers/saveAndContinueController'
import accommodationSection from './accommodation'
import financeSection from './finance'
import drugsSection from './drugs'
import alcoholSection from './alcohol'
import employmentEducationSection from './employment-education'
import healthAndWellbeingSection from './health-wellbeing'
import thinkingBehavioursAttitudeSection from './thinking-behaviours-attitudes'
import personalRelationshipsAndCommunitySection from './personal-relationships-community'
import offenceAnalysisSection from './offence-analysis'
import { assessmentComplete } from '../fields'
import { fieldCodesFrom, SanStep } from './common'
import { Section, SectionConfig } from '../config/sections'
import templates from '../config/templates'

export const sectionConfigs: SectionConfig[] = [
  {
    section: {
      title: 'Data mapping',
      code: 'data-mapping',
    },
    steps: [
      {
        url: 'data-mapping',
        template: templates.dataMapping,
      },
    ],
  },
  {
    section: {
      title: 'Print preview',
      code: 'print-preview',
    },
    steps: [
      {
        url: 'print-preview',
        controller: SaveAndContinueController,
        template: templates.printPreview,
      },
    ],
  },
  accommodationSection,
  employmentEducationSection,
  financeSection,
  drugsSection,
  alcoholSection,
  healthAndWellbeingSection,
  thinkingBehavioursAttitudeSection,
  personalRelationshipsAndCommunitySection,
  offenceAnalysisSection,
]

const toSteps = (step: SanStep, section: Section, steps: FormWizard.Steps): FormWizard.Steps => ({
  ...steps,
  [`/${step.url}`]: {
    ...step,
    pageTitle: step.pageTitle || section.title,
    section: section.code,
    controller: step.controller || SaveAndContinueController,
    fields: [assessmentComplete.code, ...fieldCodesFrom(step.fields || [])],
    template: step.template || 'forms/default',
    backLink: step.backLink || null,
  },
})

export default function buildSteps(): FormWizard.Steps {
  const stepsReducer =
    (sectionConfig: SectionConfig) => (allSectionSteps: FormWizard.Steps, step: SanStep, i: number, a: SanStep[]) =>
      toSteps({ ...step, isLastStep: i === a.length - 1 }, sectionConfig.section, allSectionSteps)
  const toSectionSteps = (allSteps: FormWizard.Steps, sectionConfig: SectionConfig) =>
    sectionConfig.steps.reduce(stepsReducer(sectionConfig), allSteps)
  return sectionConfigs.reduce(toSectionSteps, {})
}
