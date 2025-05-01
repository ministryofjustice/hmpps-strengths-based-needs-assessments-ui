import { SanStep } from './step';

export interface SectionConfig {
  steps: SanStep[]
  section: Section
}

export interface Section {
  title: string
  code: string
  url?: string
  sectionCompleteField?: string
  stepUrls?: Record<string, string>
  subSections?: Record<string, Section>
}
