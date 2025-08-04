import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from '../../../controllers/saveAndContinueController'
import accommodationSection from './accommodation'
import financeSection from './finance'
import drugUseSection from './drug-use'
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
import ViewVersionListController from '../../../controllers/viewVersionListController'
import dataPrivacyController from '../../../controllers/dataPrivacyController'
import privacyScreenFields from '../fields/privacy-screen'

export const sectionConfigs: SectionConfig[] = [
  {
    section: {
      title: '', // not used
      code: 'data-privacy',
    },
    steps: [
      {
        url: 'close-any-other-applications-before-appointment',
        controller: dataPrivacyController,
        template: templates.dataPrivacy,
        fields: [privacyScreenFields.privacyScreenDeclaration()],
        next: 'current-accommodation?action=resume',
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
  {
    section: {
      title: 'Previous versions',
      code: 'previous-versions',
    },
    steps: [
      {
        url: 'previous-versions',
        locals: {
          pageTitle: 'Previous versions',
        },
        controller: ViewVersionListController,
        template: templates.previousVersions,
      },
    ],
  },
  accommodationSection,
  employmentEducationSection,
  financeSection,
  drugUseSection,
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
