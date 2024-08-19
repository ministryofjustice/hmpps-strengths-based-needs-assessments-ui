import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import thinkingBehavioursFields from '../fields/thinking-behaviours-attitudes'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'
import { nextWhen } from './accommodation'

const section = sections.thinkingBehaviours
const stepUrls = {
  thinkingBehavioursAttitudes: 'thinking-behaviours-attitudes',
  sexualOffending: 'thinking-behaviours-attitudes-sexual-offending',
  thinkingBehaviours: 'thinking-behaviours',
  analysis: 'thinking-behaviours-attitudes-analysis',
  analysisComplete: 'thinking-behaviours-attitudes-analysis-complete',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.thinkingBehavioursAttitudes,
      fields: [
        thinkingBehavioursFields.thinkingBehavioursAttitudesConsequences,
        thinkingBehavioursFields.thinkingBehavioursAttitudesStableBehaviour,
        thinkingBehavioursFields.thinkingBehavioursAttitudesOffendingActivities,
        thinkingBehavioursFields.thinkingBehavioursAttitudesPeerPressure,
        thinkingBehavioursFields.thinkingBehavioursAttitudesPeerPressureYesDetails,
        thinkingBehavioursFields.thinkingBehavioursAttitudesPeerPressureSomeDetails,
        thinkingBehavioursFields.thinkingBehavioursAttitudesPeerPressureNoDetails,
        thinkingBehavioursFields.thinkingBehavioursAttitudesProblemSolving,
        thinkingBehavioursFields.thinkingBehavioursAttitudesPeoplesViews,
        thinkingBehavioursFields.thinkingBehavioursAttitudesManipulativePredatoryBehaviour,
        thinkingBehavioursFields.thinkingBehavioursAttitudesRiskSexualHarm,
        thinkingBehavioursFields.isUserSubmitted(stepUrls.thinkingBehavioursAttitudes),
        thinkingBehavioursFields.sectionComplete(),
      ].flat(),
      navigationOrder: 8,
      next: [
        nextWhen(thinkingBehavioursFields.thinkingBehavioursAttitudesRiskSexualHarm, 'YES', stepUrls.sexualOffending),
        nextWhen(thinkingBehavioursFields.thinkingBehavioursAttitudesRiskSexualHarm, 'NO', stepUrls.thinkingBehaviours),
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.sexualOffending,
      pageTitle: 'Risk of sexual harm',
      pageSubHeading: section.title,
      fields: [
        thinkingBehavioursFields.thinkingBehavioursAttitudesSexualPreoccupation,
        thinkingBehavioursFields.thinkingBehavioursAttitudesOffenceRelatedSexualInterest,
        thinkingBehavioursFields.thinkingBehavioursAttitudesEmotionalIntimacy,
        thinkingBehavioursFields.isUserSubmitted(stepUrls.sexualOffending),
        thinkingBehavioursFields.sectionComplete(),
      ].flat(),
      next: stepUrls.thinkingBehaviours,
      backLink: stepUrls.thinkingBehavioursAttitudes,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.thinkingBehaviours,
      fields: [
        thinkingBehavioursFields.thinkingBehavioursAttitudesTemperManagement,
        thinkingBehavioursFields.thinkingBehavioursAttitudesViolenceControllingBehaviour,
        thinkingBehavioursFields.thinkingBehavioursAttitudesImpulsiveBehaviour,
        thinkingBehavioursFields.thinkingBehavioursAttitudesPositiveAttitude,
        thinkingBehavioursFields.thinkingBehavioursAttitudesHostileOrientation,
        thinkingBehavioursFields.thinkingBehavioursAttitudesSupervision,
        thinkingBehavioursFields.thinkingBehavioursAttitudesCriminalBehaviour,
        thinkingBehavioursFields.wantToMakeChanges(),
        thinkingBehavioursFields.isUserSubmitted(stepUrls.thinkingBehaviours),
        thinkingBehavioursFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.thinkingBehavioursAttitudes,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        thinkingBehavioursFields.practitionerAnalysis(),
        thinkingBehavioursFields.isUserSubmitted(stepUrls.analysis),
        thinkingBehavioursFields.sectionComplete(),
      ].flat(),
      next: `${stepUrls.analysisComplete}#practitioner-analysis`,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysisComplete,
      template: templates.analysisComplete,
    },
  ],
}

export default sectionConfig
