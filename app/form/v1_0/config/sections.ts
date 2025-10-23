import { SanStep } from '../steps/common'

export interface SectionConfig {
  steps: SanStep[]
  section: Section
}

export interface Section {
  title: string
  code: string
  url?: string
  sectionCompleteField?: string
  navigationOrder: number
  stepUrls?: Record<string, string>
  subsections?: Record<string, Section>
}

export default {
  accommodation: {
    title: 'Accommodation',
    code: 'accommodation',
    sectionCompleteField: 'accommodation_section_complete',
    navigationOrder: 1,
    subsections: {
      background: {
        title: 'Information',
        code: 'accommodation-background',
        sectionCompleteField: 'accommodation_background_section_complete',
        navigationOrder: 1,
        stepUrls: {
          currentAccommodation: 'current-accommodation',
          settledAccommodation: 'settled-accommodation',
          temporaryAccommodation: 'temporary-accommodation',
          temporaryAccommodationCasAp: 'temporary-accommodation-cas-ap',
          noAccommodation: 'no-accommodation',
          backgroundSummary: 'accommodation-background-summary',
        },
      },
      practitionerAnalysis: {
        title: 'Practitioner analysis',
        code: 'accommodation-practitioner-analysis',
        sectionCompleteField: 'accommodation_practitioner_analysis_section_complete',
        navigationOrder: 2,
        stepUrls: {
          analysis: 'accommodation-analysis',
          analysisSummary: 'accommodation-analysis-summary',
        },
      },
    },
  },
  employmentEducation: {
    title: 'Employment and education',
    code: 'employment-education',
    sectionCompleteField: 'employment_education_section_complete',
    navigationOrder: 2,
    subsections: {
      background: {
        title: 'Information',
        code: 'employment-education-background',
        sectionCompleteField: 'employment_education_background_section_complete',
        navigationOrder: 1,
        stepUrls: {
          currentEmployment: 'current-employment',
          employed: 'employed',
          retired: 'retired',
          employedBefore: 'employed-before',
          neverEmployed: 'never-employed',
          backgroundSummary: 'employment-education-summary',
        },
      },
      practitionerAnalysis: {
        title: 'Practitioner analysis',
        code: 'employment-education-practitioner-analysis',
        sectionCompleteField: 'employment_education_practitioner_analysis_section_complete',
        navigationOrder: 2,
        stepUrls: {
          analysis: 'employment-education-analysis',
          analysisSummary: 'employment-education-analysis-summary',
        },
      },
    },
  },
  finance: {
    title: 'Finances',
    code: 'finance',
    sectionCompleteField: 'finance_section_complete',
    navigationOrder: 3,
    subsections: {
      background: {
        title: 'Information',
        code: 'finance-background',
        sectionCompleteField: 'finance_background_section_complete',
        navigationOrder: 1,
        stepUrls: {
          finance: 'finance',
          backgroundSummary: 'finance-summary',
        },
      },
      practitionerAnalysis: {
        title: 'Practitioner analysis',
        code: 'finance-practitioner-analysis',
        sectionCompleteField: 'finance_practitioner_analysis_section_complete',
        navigationOrder: 2,
        stepUrls: {
          analysis: 'finance-analysis',
          analysisSummary: 'finance-analysis-summary',
        },
      },
    },
  },
  drugsUse: {
    title: 'Drug use',
    code: 'drug-use',
    sectionCompleteField: 'drug_use_section_complete',
    navigationOrder: 4,
    subsections: {
      background: {
        title: 'Information',
        code: 'drug-use-background',
        sectionCompleteField: 'drug_use_background_section_complete',
        navigationOrder: 1,
        stepUrls: {
          drugUse: 'drug-use',
          addDrugs: 'add-drugs',
          drugDetails: 'drug-details',
          drugDetailsInjected: 'drug-details-injected',
          drugDetailsMoreThanSix: 'drug-details-more-than-six-months',
          drugDetailsMoreThanSixInjected: 'drug-details-more-than-six-months-injected',
          drugUseHistory: 'drug-use-history',
          drugUseHistoryAllMoreThanSix: 'drug-use-history-more-than-six-months',
          backgroundSummary: 'drug-use-summary',
        },
      },
      practitionerAnalysis: {
        title: 'Practitioner analysis',
        code: 'drug-use-practitioner-analysis',
        sectionCompleteField: 'drug_use_practitioner_analysis_section_complete',
        navigationOrder: 2,
        stepUrls: {
          analysis: 'drug-use-analysis',
          analysisSummary: 'drug-use-analysis-summary',
        },
      },
    },
  },
  alcohol: {
    title: 'Alcohol use',
    code: 'alcohol-use',
    sectionCompleteField: 'alcohol_use_section_complete',
    navigationOrder: 5,
    subsections: {
      background: {
        title: 'Information',
        code: 'alcohol-use-background',
        sectionCompleteField: 'alcohol_use_background_section_complete',
        navigationOrder: 1,
        stepUrls: {
          alcohol: 'alcohol',
          alcoholUseLastThreeMonths: 'alcohol-use-last-three-months',
          alcoholUseLessThreeMonths: 'alcohol-use-less-three-months',
          backgroundSummary: 'alcohol-use-background-summary',
        },
      },
      practitionerAnalysis: {
        title: 'Practitioner analysis',
        code: 'alcohol-use-practitioner-analysis',
        sectionCompleteField: 'alcohol_use_practitioner_analysis_section_complete',
        navigationOrder: 2,
        stepUrls: {
          analysis: 'alcohol-use-analysis',
          analysisSummary: 'alcohol-use-analysis-summary',
        },
      },
    },
  },
  healthWellbeing: {
    title: 'Health and wellbeing',
    code: 'health-wellbeing',
    sectionCompleteField: 'health_wellbeing_section_complete',
    navigationOrder: 6,
    subsections: {
      background: {
        title: 'Information',
        code: 'health-wellbeing-background',
        sectionCompleteField: 'health_wellbeing_background_section_complete',
        navigationOrder: 1,
        stepUrls: {
          healthWellbeing: 'health-wellbeing',
          physicalMentalHealth: 'physical-mental-health',
          physicalHealth: 'physical-health',
          mentalHealth: 'mental-health',
          noPhysicalMentalHealth: 'no-physical-mental-health',
          backgroundSummary: 'health-wellbeing-summary',
        },
      },
      practitionerAnalysis: {
        title: 'Practitioner analysis',
        code: 'health-wellbeing-practitioner-analysis',
        sectionCompleteField: 'health_wellbeing_practitioner_analysis_section_complete',
        navigationOrder: 2,
        stepUrls: {
          analysis: 'health-wellbeing-analysis',
          analysisSummary: 'health-wellbeing-analysis-summary',
        },
      },
    },
  },
  personalRelationships: {
    title: 'Personal relationships and community',
    code: 'personal-relationships-community',
    sectionCompleteField: 'personal_relationships_community_section_complete',
    navigationOrder: 7,
    subsections: {
      background: {
        title: 'Information',
        code: 'personal-relationships-community-background',
        sectionCompleteField: 'personal_relationships_community_background_section_complete',
        navigationOrder: 1,
        stepUrls: {
          personalRelationshipsChildrenInfo: 'personal-relationships-children-information',
          personalRelationships: 'personal-relationships',
          personalRelationshipsChildren: 'personal-relationships-children',
          personalRelationshipsCommunity: 'personal-relationships-community',
          backgroundSummary: 'personal-relationships-community-summary',
        },
      },
      practitionerAnalysis: {
        title: 'Practitioner analysis',
        code: 'personal-relationships-community-practitioner-analysis',
        sectionCompleteField: 'personal_relationships_community_practitioner_analysis_section_complete',
        navigationOrder: 2,
        stepUrls: {
          analysis: 'personal-relationships-community-analysis',
          analysisSummary: 'personal-relationships-community-analysis-summary',
        },
      },
    },
  },
  thinkingBehaviours: {
    title: 'Thinking, behaviours and attitudes',
    code: 'thinking-behaviours-attitudes',
    sectionCompleteField: 'thinking_behaviours_attitudes_section_complete',
    navigationOrder: 8,
    subsections: {
      background: {
        title: 'Information',
        code: 'thinking-behaviours-attitudes-background',
        sectionCompleteField: 'thinking_behaviours_attitudes_background_section_complete',
        navigationOrder: 1,
        stepUrls: {
          thinkingBehavioursAttitudes: 'thinking-behaviours-attitudes',
          riskOfSexualHarm: 'thinking-behaviours-attitudes-risk-of-sexual-harm',
          riskOfSexualHarmDetails: 'thinking-behaviours-attitudes-risk-of-sexual-harm-details',
          backgroundSummary: 'thinking-behaviours-attitudes-summary',
        },
      },
      practitionerAnalysis: {
        title: 'Practitioner analysis',
        code: 'thinking-behaviours-attitudes-practitioner-analysis',
        sectionCompleteField: 'thinking_behaviours_attitudes_practitioner_analysis_section_complete',
        navigationOrder: 2,
        stepUrls: {
          analysis: 'thinking-behaviours-attitudes-analysis',
          analysisSummary: 'thinking-behaviours-attitudes-analysis-summary',
        },
      },
    },
  },
  offenceAnalysis: {
    title: 'Offence analysis',
    code: 'offence-analysis',
    sectionCompleteField: 'offence_analysis_section_complete',
    navigationOrder: 9,
  },
} as const satisfies Record<string, Section>
