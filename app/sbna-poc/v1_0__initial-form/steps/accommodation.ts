import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'
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
      setField('accommodation_section_complete', 'NO'),
      setField('accommodation_analysis_section_complete', 'NO'),
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
    next: 'accommodation-summary-analysis',
    backLink: 'accommodation',
    section: 'accommodation',
    sectionProgressRules: [
      setFieldWhenValid('accommodation_section_complete', 'YES', 'NO'),
      setField('accommodation_analysis_section_complete', 'NO'),
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
    next: 'accommodation-summary-analysis',
    backLink: 'accommodation',
    section: 'accommodation',
    sectionProgressRules: [
      setFieldWhenValid('accommodation_section_complete', 'YES', 'NO'),
      setField('accommodation_analysis_section_complete', 'NO'),
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
    next: 'accommodation-summary-analysis',
    backLink: 'accommodation',
    section: 'accommodation',
    sectionProgressRules: [
      setFieldWhenValid('accommodation_section_complete', 'YES', 'NO'),
      setField('accommodation_analysis_section_complete', 'NO'),
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
    next: 'accommodation-summary-analysis',
    backLink: 'accommodation',
    section: 'accommodation',
    sectionProgressRules: [
      setFieldWhenValid('accommodation_section_complete', 'YES', 'NO'),
      setField('accommodation_analysis_section_complete', 'NO'),
    ],
  },
  '/no-accommodation-2': {
    pageTitle: 'Accommodation',
    fields: fieldCodesFrom(accommodationChangesFields, sectionCompleteFields),
    next: 'accommodation-summary-analysis',
    backLink: 'accommodation',
    section: 'accommodation',
    sectionProgressRules: [
      setFieldWhenValid('accommodation_section_complete', 'YES', 'NO'),
      setField('accommodation_analysis_section_complete', 'NO'),
    ],
  },
  '/accommodation-summary-analysis': {
    pageTitle: 'Accommodation',
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'accommodation-analysis-complete#practitioner-analysis',
    template: 'forms/sbna-poc/accommodation-summary-analysis',
    section: 'accommodation',
    sectionProgressRules: [setFieldWhenValid('accommodation_analysis_section_complete', 'YES', 'NO')],
  },
  '/accommodation-analysis-complete': {
    pageTitle: 'Accommodation',
    next: [],
    template: 'forms/sbna-poc/accommodation-summary-analysis-complete',
    section: 'accommodation',
  },
}

export default stepOptions
