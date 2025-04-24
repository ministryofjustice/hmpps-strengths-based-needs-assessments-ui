import { Section } from '../../common/section';

export default {
  accommodation: {
    title: 'Accommodation',
    code: 'accommodation',
    sectionCompleteField: 'accommodation_section_complete',
    stepUrls: {
      currentAccommodation: 'current-accommodation',
      settledAccommodation: 'settled-accommodation',
      temporaryAccommodation: 'temporary-accommodation',
      temporaryAccommodationCasAp: 'temporary-accommodation-cas-ap',
      noAccommodation: 'no-accommodation',
      summary: 'accommodation-summary',
      analysis: 'accommodation-analysis',
    },
  },
  employmentEducation: {
    title: 'Employment and education',
    code: 'employment-education',
    sectionCompleteField: 'employment_education_section_complete',
    stepUrls: {
      currentEmployment: 'current-employment',
      employed: 'employed',
      retired: 'retired',
      employedBefore: 'employed-before',
      neverEmployed: 'never-employed',
      summary: 'employment-education-summary',
      analysis: 'employment-education-analysis',
    },
  },
  finance: {
    title: 'Finances',
    code: 'finance',
    sectionCompleteField: 'finance_section_complete',
    stepUrls: {
      finance: 'finance',
      summary: 'finance-summary',
      analysis: 'finance-analysis',
    },
  },
  drugs: {
    title: 'Drug use',
    code: 'drug-use',
    sectionCompleteField: 'drug_use_section_complete',
    subSections: {
      background: {
        title: 'Drug use background',
        code: 'drug-use-background',
        url: 'drugs',
        stepUrls: {
          drugs: 'drugs',
          drugUse: 'drug-use',
          selectDrugs: 'select-drugs',
          drugUsageDetails: 'drug-usage-details',
          drugUseChanges: 'drug-use-changes',
          summary: 'drug-use-summary',
        },
      },
      practitionerAnalysis: {
        title: 'Practitioner analysis',
        code: 'drug-use-practitioner-analysis',
        url: 'drug-use-analysis',
        stepUrls: {
          analysis: 'drug-use-analysis',
          analysisSummary: 'drug-use-analysis-summary',
        }
      },
    },
  },
  alcohol: {
    title: 'Alcohol use',
    code: 'alcohol-use',
    sectionCompleteField: 'alcohol_use_section_complete',
    stepUrls: {
      alcohol: 'alcohol',
      alcoholUseLastThreeMonths: 'alcohol-use-last-three-months',
      alcoholUseLessThreeMonths: 'alcohol-use-less-three-months',
      summary: 'alcohol-use-summary',
      analysis: 'alcohol-use-analysis',
    }
  },
  healthWellbeing: {
    title: 'Health and wellbeing',
    code: 'health-wellbeing',
    sectionCompleteField: 'health_wellbeing_section_complete',
    stepUrls: {
      healthWellbeing: 'health-wellbeing',
      physicalMentalHealth: 'physical-mental-health',
      physicalHealth: 'physical-health',
      mentalHealth: 'mental-health',
      noPhysicalMentalHealth: 'no-physical-mental-health',
      summary: 'health-wellbeing-summary',
      analysis: 'health-wellbeing-analysis',
    },
  },
  personalRelationships: {
    title: 'Personal relationships and community',
    code: 'personal-relationships-community',
    sectionCompleteField: 'personal_relationships_community_section_complete',
    stepUrls: {
      personalRelationshipsChildrenInfo: 'personal-relationships-children-information',
      personalRelationships: 'personal-relationships',
      personalRelationshipsChildren: 'personal-relationships-children',
      personalRelationshipsCommunity: 'personal-relationships-community',
      summary: 'personal-relationships-community-summary',
      analysis: 'personal-relationships-community-analysis',
    },
  },
  thinkingBehaviours: {
    title: 'Thinking, behaviours and attitudes',
    code: 'thinking-behaviours-attitudes',
    sectionCompleteField: 'thinking_behaviours_attitudes_section_complete',
    stepUrls: {
      thinkingBehavioursAttitudes: 'thinking-behaviours-attitudes',
      riskOfSexualHarm: 'thinking-behaviours-attitudes-risk-of-sexual-harm',
      riskOfSexualHarmDetails: 'thinking-behaviours-attitudes-risk-of-sexual-harm-details',
      summary: 'thinking-behaviours-attitudes-summary',
      analysis: 'thinking-behaviours-attitudes-analysis',
    },
  },
  offenceAnalysis: {
    title: 'Offence analysis',
    code: 'offence-analysis',
    sectionCompleteField: 'offence_analysis_section_complete',
    stepUrls: {
      offenceAnalysis: 'offence-analysis',
      offenceAnalysisVictimCreate: 'offence-analysis-victim/create',
      offenceAnalysisVictimDelete: 'offence-analysis-victim/delete',
      offenceAnalysisVictimUpdate: 'offence-analysis-victim/edit',
      offenceAnalysisVictimsSummary: 'offence-analysis-victim-details',
      offenceAnalysisInvolvedParties: 'offence-analysis-involved-parties',
      offenceAnalysisImpact: 'offence-analysis-impact',
      offenceAnalysisImpactOthersInvolved: 'offence-analysis-impact-others-involved',
      summary: 'offence-analysis-summary',
    },
  },
} as const satisfies Record<string, Section>
