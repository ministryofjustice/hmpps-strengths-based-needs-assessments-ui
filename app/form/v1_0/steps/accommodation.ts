import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import accommodationFields from '../fields/accommodation'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.accommodation
const stepUrls = {
  accommodation: 'accommodation',
  settledAccommodation: 'settled-accommodation',
  temporaryAccommodation: 'temporary-accommodation',
  temporaryAccommodation2: 'temporary-accommodation-2',
  noAccommodation: 'no-accommodation',
  analysis: 'accommodation-analysis',
  analysisComplete: 'accommodation-analysis-complete',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.accommodation,
      fields: [
        ...accommodationFields.accommodationType,
        ...accommodationFields.isUserSubmitted(stepUrls.accommodation),
        ...accommodationFields.sectionComplete(),
      ],
      next: [
        { field: 'current_accommodation', value: 'SETTLED', next: stepUrls.settledAccommodation },
        {
          field: 'current_accommodation',
          value: 'TEMPORARY',
          next: [
            { field: 'type_of_temporary_accommodation', value: 'SHORT_TERM', next: stepUrls.temporaryAccommodation },
            { field: 'type_of_temporary_accommodation', value: 'IMMIGRATION', next: stepUrls.temporaryAccommodation },
            stepUrls.temporaryAccommodation2,
          ],
        },
        { field: 'current_accommodation', value: 'NO_ACCOMMODATION', next: stepUrls.noAccommodation },
      ],
      navigationOrder: 1,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.settledAccommodation,
      fields: [
        ...accommodationFields.livingWith,
        ...accommodationFields.suitableLocation,
        ...accommodationFields.suitableAccommodation,
        ...accommodationFields.wantToMakeChanges(),
        ...accommodationFields.isUserSubmitted(stepUrls.settledAccommodation),
        ...accommodationFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.accommodation,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.temporaryAccommodation,
      fields: [
        ...accommodationFields.livingWith,
        ...accommodationFields.suitableLocation,
        ...accommodationFields.suitableAccommodation,
        ...accommodationFields.suitableHousingPlanned,
        ...accommodationFields.wantToMakeChanges(),
        ...accommodationFields.isUserSubmitted(stepUrls.temporaryAccommodation),
        ...accommodationFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.accommodation,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.temporaryAccommodation2,
      fields: [
        ...accommodationFields.suitableAccommodation,
        ...accommodationFields.suitableHousingPlanned,
        ...accommodationFields.wantToMakeChanges(),
        ...accommodationFields.isUserSubmitted(stepUrls.temporaryAccommodation2),
        ...accommodationFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.accommodation,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.noAccommodation,
      fields: [
        ...accommodationFields.noAccommodation,
        ...accommodationFields.suitableHousingPlanned,
        ...accommodationFields.wantToMakeChanges(),
        ...accommodationFields.isUserSubmitted(stepUrls.noAccommodation),
        ...accommodationFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.accommodation,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        ...accommodationFields.practitionerAnalysis(),
        ...accommodationFields.isUserSubmitted(stepUrls.analysis),
        ...accommodationFields.sectionComplete(),
      ],
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
