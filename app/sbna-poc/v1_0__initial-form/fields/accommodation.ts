import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  characterLimit,
  createPractitionerAnalysisFieldsWith,
  createWantToMakeChangesFields,
  validateFutureDate,
  getMediumLabelClassFor,
  orDivider,
  toFormWizardFields,
  visuallyHidden,
  yesNoOptions,
} from './common'
import { formatDateForDisplay } from '../../../../server/utils/nunjucks.utils'

const immigrationAccommodationHint = `
    <div class="govuk-!-width-two-thirds">
      <p class="govuk-hint">This includes:</p>
      <ul class="govuk-hint govuk-list govuk-list--bullet">
        <li>Schedule 10 - Home Office provides accommodation under the Immigration Act 2016</li>
        <li>Schedule 4 - Home Office provides accommodation for those on immigration bail, prior to the Immigration Act 2016</li>
      </ul>
    </div>
  `

const currentAccommodationHint = `
    <details class="govuk-details" data-module="govuk-details">
      <summary class="govuk-details__summary">
        <span class="govuk-details__summary-text">
          Help if accommodation is a caravan or living vehicle
        </span>
      </summary>
      <div class="govuk-details__text">
        <p>If they're in a caravan or a living vehicle legally, select 'Settled' or 'Temporary'.</p>

        <p>If they're not in a legal place, select 'No accommodation'.</p>
      </div>
    </details>
  `

const noAccommodationHint = `
  <div class="govuk-!-width-two-thirds">
    <p class="govuk-hint">Consider current and past homelessness issues.</p>
    <p class="govuk-hint">Select all that apply.</p>
  </div>
`

const suitableHousingConcernsOptions: FormWizard.Field.Options = [
  { text: 'Inappropriate amenities or facilities', value: 'FACILITIES', kind: 'option' },
  { text: 'Overcrowding', value: 'OVERCROWDING', kind: 'option' },
  { text: 'Risk of accommodation exploited - for example, cuckooing', value: 'EXPLOITATION', kind: 'option' },
  { text: 'Safety of accommodation', value: 'SAFETY', kind: 'option' },
  { text: 'Victim lives with them', value: 'LIVES_WITH_VICTIM', kind: 'option' },
  { text: 'Victimised by someone living with them', value: 'VICTIMISATION', kind: 'option' },
  { text: 'Other', value: 'OTHER', kind: 'option' },
]

export function livingWithValidator() {
  const answers = this.values.living_with || []
  return !(answers.includes('ALONE') && answers.length > 1)
}

export const questionSectionComplete: FormWizard.Field = {
  text: 'Is the accommodation section complete?',
  code: 'accommodation_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const analysisSectionComplete: FormWizard.Field = {
  text: 'Is the accommodation analysis section complete?',
  code: 'accommodation_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const sectionCompleteFields: Array<FormWizard.Field> = [questionSectionComplete, analysisSectionComplete]

const endDateSummaryDisplay = (value: string) => `Expected end date:\n${formatDateForDisplay(value) || 'Not provided'}`

export const accommodationTypeFields: Array<FormWizard.Field> = [
  {
    text: "What is [subject]'s current accommodation?",
    hint: { html: currentAccommodationHint, kind: 'html' },
    code: 'current_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select current accommodation' }],
    options: [
      { text: 'Settled', value: 'SETTLED', kind: 'option' },
      { text: 'Temporary', value: 'TEMPORARY', kind: 'option' },
      { text: 'No accommodation', value: 'NO_ACCOMMODATION', kind: 'option' },
    ],
  },
  {
    text: 'Select the type of settled accommodation?',
    code: 'type_of_settled_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the type of settled accommodation' }],
    options: [
      { text: 'Homeowner', value: 'HOMEOWNER', kind: 'option' },
      { text: 'Living with friends or family', value: 'FRIENDS_OR_FAMILY', kind: 'option' },
      { text: 'Renting privately', value: 'RENTING_PRIVATELY', kind: 'option' },
      { text: 'Renting from social, local authority or other', value: 'RENTING_OTHER', kind: 'option' },
      { text: 'Residential healthcare', value: 'RESIDENTIAL_HEALTHCARE', kind: 'option' },
      { text: 'Supported accommodation', value: 'SUPPORTED_ACCOMMODATION', kind: 'option' },
    ],
    dependent: {
      field: 'current_accommodation',
      value: 'SETTLED',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Select the type of temporary accommodation?',
    code: 'type_of_temporary_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the type of temporary accommodation' }],
    options: [
      { text: 'Approved premises', value: 'APPROVED_PREMISES', kind: 'option' },
      { text: 'Community Accommodation Service Tier 2 (CAS2)', value: 'CAS2', kind: 'option' },
      { text: 'Community Accommodation Service Tier 3 (CAS3)', value: 'CAS3', kind: 'option' },
      {
        text: 'Immigration accommodation',
        value: 'IMMIGRATION',
        hint: { html: immigrationAccommodationHint },
        kind: 'option',
      },
      { text: 'Short term accommodation', value: 'SHORT_TERM', kind: 'option' },
    ],
    dependent: {
      field: 'current_accommodation',
      value: 'TEMPORARY',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Enter expected end date (optional)',
    code: 'short_term_accommodation_end_date',
    type: FieldType.Date,
    validate: [{ fn: validateFutureDate, message: 'Enter a future date' }],
    dependent: {
      field: 'type_of_temporary_accommodation',
      value: 'SHORT_TERM',
      displayInline: true,
    },
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
  },
  {
    text: 'Enter expected end date (optional)',
    code: 'approved_premises_end_date',
    type: FieldType.Date,
    validate: [{ fn: validateFutureDate, message: 'Enter a future date' }],
    dependent: {
      field: 'type_of_temporary_accommodation',
      value: 'APPROVED_PREMISES',
      displayInline: true,
    },
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
  },
  {
    text: 'Enter expected end date (optional)',
    code: 'cas2_end_date',
    type: FieldType.Date,
    validate: [{ fn: validateFutureDate, message: 'Enter a future date' }],
    dependent: {
      field: 'type_of_temporary_accommodation',
      value: 'CAS2',
      displayInline: true,
    },
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
  },
  {
    text: 'Enter expected end date (optional)',
    code: 'cas3_end_date',
    type: FieldType.Date,
    validate: [{ fn: validateFutureDate, message: 'Enter a future date' }],
    dependent: {
      field: 'type_of_temporary_accommodation',
      value: 'CAS3',
      displayInline: true,
    },
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
  },
  {
    text: 'Enter expected end date (optional)',
    code: 'immigration_accommodation_end_date',
    type: FieldType.Date,
    validate: [{ fn: validateFutureDate, message: 'Enter a future date' }],
    dependent: {
      field: 'type_of_temporary_accommodation',
      value: 'IMMIGRATION',
      displayInline: true,
    },
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
  },
  {
    text: 'Select the type of accommodation?',
    code: 'type_of_no_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the type of no accommodation' }],
    options: [
      { text: 'Awaiting assessment', value: 'AWAITING_ASSESSMENT', kind: 'option' },
      { text: 'Campsite', value: 'CAMPSITE', kind: 'option' },
      { text: 'Emergency hostel', value: 'EMERGENCY_HOSTEL', kind: 'option' },
      { text: 'Homeless - includes squatting', value: 'HOMELESS', kind: 'option' },
      { text: 'Rough sleeping', value: 'ROUGH_SLEEPING', kind: 'option' },
      { text: 'Shelter', value: 'SHELTER', kind: 'option' },
    ],
    dependent: {
      field: 'current_accommodation',
      value: 'NO_ACCOMMODATION',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    code: 'awaiting_assessment_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'type_of_no_accommodation',
      value: 'AWAITING_ASSESSMENT',
      displayInline: true,
    },
  },
]

export const accommodationChangesFields = createWantToMakeChangesFields('their accommodation', 'accommodation')

export const livingWithFields: Array<FormWizard.Field> = [
  {
    text: 'Who is [subject] living with?',
    hint: { text: 'Select all that apply.', kind: 'text' },
    code: 'living_with',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [
      { type: ValidationType.Required, message: "Select who they are living with, or select 'Alone'" },
      { fn: livingWithValidator, message: "Select who they are living with, or select 'Alone'" },
    ],
    options: [
      { text: 'Family', value: 'FAMILY', kind: 'option' },
      { text: 'Friends', value: 'FRIENDS', kind: 'option' },
      { text: 'Partner', value: 'PARTNER', kind: 'option' },
      { text: 'Person under 18 years old', value: 'PERSON_UNDER_18', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
      orDivider,
      { text: 'Alone', value: 'ALONE', kind: 'option', behaviour: 'exclusive' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
    text: 'Give details (optional)',
    hint: { text: 'Include name, date of birth or age, gender and their relationship to [subject]', kind: 'text' },
    code: 'living_with_person_under_18_details',
    type: FieldType.TextArea,
    dependent: {
      field: 'living_with',
      value: 'PERSON_UNDER_18',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    hint: { text: 'Include name, age and gender.', kind: 'text' },
    code: 'living_with_partner_details',
    type: FieldType.TextArea,
    dependent: {
      field: 'living_with',
      value: 'PARTNER',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'living_with_other',
    type: FieldType.TextArea,
    dependent: {
      field: 'living_with',
      value: 'OTHER',
      displayInline: true,
    },
  },
]

export const suitableLocationFields: Array<FormWizard.Field> = [
  {
    text: "Is the location of [subject]'s accommodation suitable?",
    code: 'suitable_housing_location',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if the location of the accommodation is suitable' }],
    options: yesNoOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'What are the concerns with the location?',
    hint: { text: 'Select all that apply (optional)', kind: 'text' },
    code: 'suitable_housing_location_concerns',
    type: FieldType.CheckBox,
    multiple: true,
    options: [
      { text: 'Close to criminal associates', value: 'CRIMINAL_ASSOCIATES', kind: 'option' },
      { text: 'Close to someone who has victimised them', value: 'VICTIMISATION', kind: 'option' },
      { text: 'Close to victim or possible victims', value: 'VICTIM_PROXIMITY', kind: 'option' },
      { text: 'Difficulty with neighbours', value: 'NEIGHBOUR_DIFFICULTY', kind: 'option' },
      { text: 'Honour-based perpetrator or victim', value: 'HONOUR_BASED', kind: 'option' },
      { text: 'Safety of the area', value: 'AREA_SAFETY', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    dependent: {
      field: 'suitable_housing_location',
      value: 'NO',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    code: 'suitable_housing_location_concerns_other_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'suitable_housing_location_concerns',
      value: 'OTHER',
      displayInline: true,
    },
  },
]

export const suitableAccommodationFields: Array<FormWizard.Field> = [
  {
    text: "Is [subject]'s overall accommodation suitable?",
    code: 'suitable_housing',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if the overall accommodation is suitable' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'Yes, with concerns', value: 'YES_WITH_CONCERNS', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'What are the concerns?',
    hint: { text: 'Select all that apply (optional)', kind: 'text' },
    code: 'suitable_housing_concerns',
    type: FieldType.CheckBox,
    multiple: true,
    options: suitableHousingConcernsOptions,
    dependent: {
      field: 'suitable_housing',
      value: 'YES_WITH_CONCERNS',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    code: 'suitable_housing_concerns_other_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'suitable_housing_concerns',
      value: 'OTHER',
      displayInline: true,
    },
  },
  {
    text: 'What are the concerns?',
    hint: { text: 'Select all that apply (optional)', kind: 'text' },
    code: 'unsuitable_housing_concerns',
    type: FieldType.CheckBox,
    multiple: true,
    options: suitableHousingConcernsOptions,
    dependent: {
      field: 'suitable_housing',
      value: 'NO',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    code: 'unsuitable_housing_concerns_other_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'unsuitable_housing_concerns',
      value: 'OTHER',
      displayInline: true,
    },
  },
]

export const suitableHousingPlannedFields: Array<FormWizard.Field> = [
  {
    text: 'Does [subject] have future accommodation planned?',
    code: 'suitable_housing_planned',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have future accommodation planned' }],
    options: yesNoOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'What is the type of future accommodation?',
    code: 'future_accommodation_type',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the type of future accommodation' }],
    options: [
      { text: 'Awaiting assessment', value: 'AWAITING_ASSESSMENT', kind: 'option' },
      { text: 'Awaiting placement', value: 'AWAITING_PLACEMENT', kind: 'option' },
      { text: 'Buy a house', value: 'BUYING_HOUSE', kind: 'option' },
      { text: 'Living with friends or family', value: 'LIVING_WITH_FRIENDS_OR_FAMILY', kind: 'option' },
      { text: 'Rent privately', value: 'RENT_PRIVATELY', kind: 'option' },
      { text: 'Rent from social, local authority or other', value: 'RENT_SOCIAL', kind: 'option' },
      { text: 'Residential healthcare', value: 'RESIDENTIAL_HEALTHCARE', kind: 'option' },
      { text: 'Supported accommodation', value: 'SUPPORTED_ACCOMMODATION', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    dependent: {
      field: 'suitable_housing_planned',
      value: 'YES',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    code: 'suitable_housing_planned_awaiting_assessment_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'future_accommodation_type',
      value: 'AWAITING_ASSESSMENT',
      displayInline: true,
    },
  },
  {
    text: 'Give details',
    code: 'awaiting_accommodation_placement_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'future_accommodation_type',
      value: 'AWAITING_PLACEMENT',
      displayInline: true,
    },
  },
  {
    text: 'Give details',
    hint: { text: 'Include where and who with.', kind: 'text' },
    code: 'suitable_housing_planned_other_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'future_accommodation_type',
      value: 'OTHER',
      displayInline: true,
    },
  },
]

export const noAccommodationFields: Array<FormWizard.Field> = [
  {
    text: 'Why does [subject] have no accommodation?',
    hint: { html: noAccommodationHint, kind: 'html' },
    code: 'no_accommodation_reason',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select why they have no accommodation' }],
    options: [
      { text: 'Alcohol related problems', value: 'ALCOHOL_PROBLEMS', kind: 'option' },
      { text: 'Drug related problems', value: 'DRUG_PROBLEMS', kind: 'option' },
      { text: 'Financial difficulties', value: 'FINANCIAL_DIFFICULTIES', kind: 'option' },
      { text: 'Left previous accommodation due to risk to others', value: 'RISK_TO_OTHERS', kind: 'option' },
      { text: 'Left previous accommodation for their own safety', value: 'SAFETY', kind: 'option' },
      { text: 'No accommodation when released from prison', value: 'PRISON_RELEASE', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
    text: 'Give details',
    code: 'no_accommodation_reason_other_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'no_accommodation_reason',
      value: 'OTHER',
      displayInline: true,
    },
  },
  {
    text: 'What has helped [subject] stay in accommodation in the past? (optional)',
    code: 'past_accommodation_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
]

export const practitionerAnalysisFields: Array<FormWizard.Field> = createPractitionerAnalysisFieldsWith('accommodation')

export default [
  ...sectionCompleteFields,
  ...accommodationTypeFields,
  ...accommodationChangesFields,
  ...livingWithFields,
  ...suitableLocationFields,
  ...suitableAccommodationFields,
  ...suitableHousingPlannedFields,
  ...noAccommodationFields,
  ...practitionerAnalysisFields,
].reduce(toFormWizardFields, {})
