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
        title: 'Accommodation background',
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
  },
  finance: {
    title: 'Finances',
    code: 'finance',
    sectionCompleteField: 'finance_section_complete',
    navigationOrder: 3,
  },
  alcohol: {
    title: 'Alcohol use',
    code: 'alcohol-use',
    sectionCompleteField: 'alcohol_use_section_complete',
    navigationOrder: 5,
  },
  drugsUse: {
    title: 'Drug use',
    code: 'drug-use',
    sectionCompleteField: 'drug_use_section_complete',
    navigationOrder: 4,
  },
  healthWellbeing: {
    title: 'Health and wellbeing',
    code: 'health-wellbeing',
    sectionCompleteField: 'health_wellbeing_section_complete',
    navigationOrder: 6,
  },
  personalRelationships: {
    title: 'Personal relationships and community',
    code: 'personal-relationships-community',
    sectionCompleteField: 'personal_relationships_community_section_complete',
    navigationOrder: 7,
  },
  thinkingBehaviours: {
    title: 'Thinking, behaviours and attitudes',
    code: 'thinking-behaviours-attitudes',
    sectionCompleteField: 'thinking_behaviours_attitudes_section_complete',
    navigationOrder: 8,
  },
  offenceAnalysis: {
    title: 'Offence analysis',
    code: 'offence-analysis',
    sectionCompleteField: 'offence_analysis_section_complete',
    navigationOrder: 9,
  },
} as const satisfies Record<string, Section>
