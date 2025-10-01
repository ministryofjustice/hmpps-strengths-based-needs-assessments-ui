import { setFieldToCompleteWhenValid, nextWhen } from './common'
import thinkingBehavioursFields from '../fields/thinking-behaviours-attitudes'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.thinkingBehaviours
const sectionBackground = section.subsections.background
const sectionPractitionerAnalysis = section.subsections.practitionerAnalysis

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: 'thinking-behaviours-attitudes-tasks',
      template: templates.sectionTasks,
    },
    {
      url: sectionBackground.stepUrls.thinkingBehavioursAttitudes,
      initialStepInSection: true,
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
        thinkingBehavioursFields.thinkingBehavioursAttitudesTemperManagement,
        thinkingBehavioursFields.thinkingBehavioursAttitudesViolenceControllingBehaviour,
        thinkingBehavioursFields.thinkingBehavioursAttitudesImpulsiveBehaviour,
        thinkingBehavioursFields.thinkingBehavioursAttitudesPositiveAttitude,
        thinkingBehavioursFields.thinkingBehavioursAttitudesHostileOrientation,
        thinkingBehavioursFields.thinkingBehavioursAttitudesSupervision,
        thinkingBehavioursFields.thinkingBehavioursAttitudesCriminalBehaviour,
        thinkingBehavioursFields.wantToMakeChanges(),
        thinkingBehavioursFields.isUserSubmitted(sectionBackground.stepUrls.thinkingBehavioursAttitudes),
        thinkingBehavioursFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.riskOfSexualHarm,
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.riskOfSexualHarm,
      pageTitle: 'Risk of sexual harm',
      pageSubHeading: section.title,
      fields: [
        thinkingBehavioursFields.thinkingBehavioursAttitudesRiskSexualHarm,
        thinkingBehavioursFields.isUserSubmitted(sectionBackground.stepUrls.riskOfSexualHarm),
        thinkingBehavioursFields.backgroundSectionComplete(),
      ].flat(),
      next: [
        nextWhen(
          thinkingBehavioursFields.thinkingBehavioursAttitudesRiskSexualHarm,
          'YES',
          sectionBackground.stepUrls.riskOfSexualHarmDetails,
        ),
        sectionBackground.stepUrls.backgroundSummary,
      ],
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.riskOfSexualHarmDetails,
      pageTitle: 'Risk of sexual harm',
      pageSubHeading: section.title,
      fields: [
        thinkingBehavioursFields.thinkingBehavioursAttitudesSexualPreoccupation,
        thinkingBehavioursFields.thinkingBehavioursAttitudesOffenceRelatedSexualInterest,
        thinkingBehavioursFields.thinkingBehavioursAttitudesEmotionalIntimacy,
        thinkingBehavioursFields.isUserSubmitted(sectionBackground.stepUrls.riskOfSexualHarmDetails),
        thinkingBehavioursFields.sectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.backgroundSummary,
      template: templates.backgroundSummary,
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysis,
      initialStepInSection: true,
      template: templates.analysis,
      fields: [
        thinkingBehavioursFields.isUserSubmitted(sectionPractitionerAnalysis.stepUrls.analysis),
        thinkingBehavioursFields.practitionerAnalysis(),
        thinkingBehavioursFields.practitionerAnalysisSectionComplete(),
        thinkingBehavioursFields.sectionComplete(),
      ].flat(),
      next: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      sectionProgressRules: [
        setFieldToCompleteWhenValid(sectionPractitionerAnalysis.sectionCompleteField),
        setFieldToCompleteWhenValid(section.sectionCompleteField),
      ],
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      template: templates.analysisSummary,
    },
  ],
}

export default sectionConfig
