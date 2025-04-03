import { SanStep } from '../steps/common'

export interface SectionConfig {
  steps: SanStep[]
  groups: Record<string, string>
  section: Section
}

export interface Section {
  title: string
  code: string
  order: number
  sectionCompleteField?: string
}

export default {
  accommodation: {
    title: 'Accommodation',
    code: 'accommodation',
    sectionCompleteField: 'accommodation_section_complete',
    order: 1,
  },
  employmentEducation: {
    title: 'Employment and education',
    code: 'employment-education',
    sectionCompleteField: 'employment_education_section_complete',
    order: 2,
  },
  finance: {
    title: 'Finances',
    code: 'finance',
    sectionCompleteField: 'finance_section_complete',
    order: 3,
  },
  drugs: {
    title: 'Drug use',
    code: 'drug-use',
    sectionCompleteField: 'drug_use_section_complete',
    order: 4,
  },
  alcohol: {
    title: 'Alcohol use',
    code: 'alcohol-use',
    sectionCompleteField: 'alcohol_use_section_complete',
    order: 5,
  },
  healthWellbeing: {
    title: 'Health and wellbeing',
    code: 'health-wellbeing',
    sectionCompleteField: 'health_wellbeing_section_complete',
    order: 6,
  },
  personalRelationships: {
    title: 'Personal relationships and community',
    code: 'personal-relationships-community',
    sectionCompleteField: 'personal_relationships_community_section_complete',
    order: 7,
  },
  thinkingBehaviours: {
    title: 'Thinking, behaviours and attitudes',
    code: 'thinking-behaviours-attitudes',
    sectionCompleteField: 'thinking_behaviours_attitudes_section_complete',
    order: 8,
  },
  offenceAnalysis: {
    title: 'Offence analysis',
    code: 'offence-analysis',
    sectionCompleteField: 'offence_analysis_section_complete',
    order: 9,
  },
}
