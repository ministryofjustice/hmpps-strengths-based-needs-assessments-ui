import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import {
  accommodationChangesFields,
  accommodationTypeFields,
  analysisSectionComplete,
  livingWithFields,
  noAccommodationFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
  suitableLocationFields,
  suitableAccommodationFields,
  suitableHousingPlannedFields,
} from '../fields/accommodation'

const stepOptions: FormWizard.Steps = {
  '/accommodation': {
    pageTitle: 'Accommodation',
    fields: fieldCodesFrom(accommodationTypeFields, sectionCompleteFields),
    next: [
      { field: 'current_accommodation', value: 'SETTLED', next: 'settled-accommodation' },
      {
        field: 'current_accommodation',
        value: 'TEMPORARY',
        next: [
          { field: 'type_of_temporary_accommodation', value: 'SHORT_TERM', next: 'temporary-accommodation' },
          { field: 'type_of_temporary_accommodation', value: 'IMMIGRATION', next: 'temporary-accommodation' },
          'temporary-accommodation-2',
        ],
      },
      {
        field: 'current_accommodation',
        value: 'NO_ACCOMMODATION',
        next: [
          { field: 'type_of_no_accommodation', value: 'AWAITING_ASSESSMENT', next: 'no-accommodation-2' },
          'no-accommodation',
        ],
      },
    ],
    navigationOrder: 1,
    section: 'accommodation',
    sectionProgressRules: [
      setFieldToIncomplete('accommodation_section_complete'),
      setFieldToIncomplete('accommodation_analysis_section_complete'),
    ],
  },
  '/settled-accommodation': {
    pageTitle: 'Accommodation',
    fields: fieldCodesFrom(
      livingWithFields,
      suitableLocationFields,
      suitableAccommodationFields,
      accommodationChangesFields,
      sectionCompleteFields,
    ),
    next: 'accommodation-analysis',
    backLink: 'accommodation',
    section: 'accommodation',
    sectionProgressRules: [
      setFieldToCompleteWhenValid('accommodation_section_complete'),
      setFieldToIncomplete('accommodation_analysis_section_complete'),
    ],
  },
  '/temporary-accommodation': {
    pageTitle: 'Accommodation',
    fields: fieldCodesFrom(
      livingWithFields,
      suitableLocationFields,
      suitableAccommodationFields,
      suitableHousingPlannedFields,
      accommodationChangesFields,
      sectionCompleteFields,
    ),
    next: 'accommodation-analysis',
    backLink: 'accommodation',
    section: 'accommodation',
    sectionProgressRules: [
      setFieldToCompleteWhenValid('accommodation_section_complete'),
      setFieldToIncomplete('accommodation_analysis_section_complete'),
    ],
  },
  '/temporary-accommodation-2': {
    pageTitle: 'Accommodation',
    fields: fieldCodesFrom(
      suitableAccommodationFields,
      suitableHousingPlannedFields,
      accommodationChangesFields,
      sectionCompleteFields,
    ),
    next: 'accommodation-analysis',
    backLink: 'accommodation',
    section: 'accommodation',
    sectionProgressRules: [
      setFieldToCompleteWhenValid('accommodation_section_complete'),
      setFieldToIncomplete('accommodation_analysis_section_complete'),
    ],
  },
  '/no-accommodation': {
    pageTitle: 'Accommodation',
    fields: fieldCodesFrom(
      noAccommodationFields,
      suitableHousingPlannedFields,
      accommodationChangesFields,
      sectionCompleteFields,
    ),
    next: 'accommodation-analysis',
    backLink: 'accommodation',
    section: 'accommodation',
    sectionProgressRules: [
      setFieldToCompleteWhenValid('accommodation_section_complete'),
      setFieldToIncomplete('accommodation_analysis_section_complete'),
    ],
  },
  '/no-accommodation-2': {
    pageTitle: 'Accommodation',
    fields: fieldCodesFrom(accommodationChangesFields, sectionCompleteFields),
    next: 'accommodation-analysis',
    backLink: 'accommodation',
    section: 'accommodation',
    sectionProgressRules: [
      setFieldToCompleteWhenValid('accommodation_section_complete'),
      setFieldToIncomplete('accommodation_analysis_section_complete'),
    ],
  },
  '/accommodation-analysis': {
    pageTitle: 'Accommodation',
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'accommodation-analysis-complete#practitioner-analysis',
    template: 'forms/summary/summary-analysis-incomplete',
    section: 'accommodation',
    sectionProgressRules: [setFieldToCompleteWhenValid('accommodation_analysis_section_complete')],
  },
  '/accommodation-analysis-complete': {
    pageTitle: 'Accommodation',
    next: [],
    template: 'forms/summary/summary-analysis-complete',
    section: 'accommodation',
  },
}

export default stepOptions
