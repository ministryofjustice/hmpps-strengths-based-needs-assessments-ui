import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import { DateTime } from 'luxon'

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
  { text: 'Safety of accommodation', value: 'SAFETY', kind: 'option' },
  { text: 'Overcrowding', value: 'OVERCROWDING', kind: 'option' },
  { text: 'Victim lives with them', value: 'LIVES_WITH_VICTIM', kind: 'option' },
  { text: 'Victimised by someone living with them', value: 'VICTIMISATION', kind: 'option' },
  { text: 'Inappropriate amenities or facilities', value: 'FACILITIES', kind: 'option' },
  { text: 'Risk of accommodation exploited - for example, cuckooing', value: 'EXPLOITATION', kind: 'option' },
  { text: 'Other', value: 'OTHER', kind: 'option' },
]

const orDivider: FormWizard.Field.Divider = {
  divider: 'or',
  kind: 'divider',
}

function futureDateValidator(value: string) {
  const now = DateTime.now().startOf('day')
  const date = DateTime.fromISO(value)
  return date >= now
}

function livingWithValidator() {
  const answers = this.values.living_with || []
  return !(answers.includes('ALONE') && answers.length > 1)
}

function createRequiredIfCollectionContainsWith(field: string, requiredValue: string) {
  return function requiredIfCollectionContains(value: string) {
    const persistedAnswers = this.sessionModel?.options?.req?.form?.persistedAnswers || {}
    const values = persistedAnswers[field]?.values

    return (
      Array.isArray(values) && (!values.includes(requiredValue) || (values.includes(requiredValue) && value !== ''))
    )
  }
}

const characterLimit = 400
const summaryCharacterLimit = 4000

const mediumLabel = 'govuk-label--m'
const visuallyHidden = 'govuk-visually-hidden'

const createReceivingTreatment = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
  dependentFieldValue: string,
): FormWizard.Field => ({
  text: 'Is [subject] receiving treatment?',
  code: fieldCode,
  type: FieldType.Radio,
  validate: [
    {
      fn: createRequiredIfCollectionContainsWith('drug_use_type', dependentFieldValue),
      message: 'Select if they are receiving treatment',
    },
  ],
  options: [
    { text: 'Yes', value: 'YES', kind: 'option' },
    { text: 'No', value: 'NO', kind: 'option' },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const createInjectingDrug = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
  dependentFieldValue: string,
): FormWizard.Field => ({
  text: 'Is [subject] injecting this drug?',
  code: fieldCode,
  type: FieldType.Radio,
  validate: [
    {
      fn: createRequiredIfCollectionContainsWith('drug_use_type', dependentFieldValue),
      message: 'Select if they are injecting this drug',
    },
  ],
  options: [
    { text: 'Yes', value: 'YES', kind: 'option' },
    { text: 'No', value: 'NO', kind: 'option' },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const createPastDrugUsage = (fieldCode: string, dependentFieldValue: string): FormWizard.Field => ({
  text: 'Has [subject] used this drug in the past?',
  code: fieldCode,
  type: FieldType.Radio,
  validate: [
    {
      fn: createRequiredIfCollectionContainsWith('drug_use_type', dependentFieldValue),
      message: 'Select if they have used this drug in the past',
    },
  ],
  options: [
    { text: 'Yes', value: 'YES', kind: 'option' },
    { text: 'No', value: 'NO', kind: 'option' },
  ],
  labelClasses: mediumLabel,
})

const createPastInjectingDrug = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
  dependentFieldValue: string,
): FormWizard.Field => ({
  text: 'Was [subject] injecting this drug?',
  code: fieldCode,
  type: FieldType.Radio,
  validate: [
    {
      fn: createRequiredIfCollectionContainsWith('drug_use_type', dependentFieldValue),
      message: 'Select if they were injecting this drug',
    },
  ],
  options: [
    { text: 'Yes', value: 'YES', kind: 'option' },
    { text: 'No', value: 'NO', kind: 'option' },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const createDebtType = (fieldCode: string, dependentFieldCode: string, valueCode: string): FormWizard.Field => ({
  text: 'Select type of debt',
  code: fieldCode,
  type: FieldType.Radio,
  validate: [{ type: ValidationType.Required, message: 'Error message' }],
  options: [
    { text: 'Formal debt', value: 'FORMAL_DEBT', kind: 'option' },
    { text: 'Debt to others', value: 'DEBT_TO_OTHERS', kind: 'option' },
    { text: 'Formal debt and debt to others', value: 'FORMAL_AND_DEBT_TO_OTHERS', kind: 'option' },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const createFormalDebtDetails = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
): FormWizard.Field => ({
  text: 'Give details (optional)',
  hint: { text: 'Includes things like credit cards, phone bills or rent arrears.', kind: 'text' },
  code: fieldCode,
  type: FieldType.TextArea,
  validate: [
    {
      type: ValidationType.MaxLength,
      arguments: [characterLimit],
      message: `Details must be ${characterLimit} characters or less`,
    },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const createDebtToOthersDetails = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
): FormWizard.Field => ({
  text: 'Give details (optional)',
  hint: { text: 'Includes things like owing money to family, friends, other prisoners or loan sharks.', kind: 'text' },
  code: fieldCode,
  type: FieldType.TextArea,
  validate: [
    {
      type: ValidationType.MaxLength,
      arguments: [characterLimit],
      message: `Details must be ${characterLimit} characters or less`,
    },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const createFormalAndDebtOthersDetails = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
): FormWizard.Field => ({
  text: 'Give details (optional)',
  hint: { text: 'Includes things like rent arrears and owing others money.', kind: 'text' },
  code: fieldCode,
  type: FieldType.TextArea,
  validate: [
    {
      type: ValidationType.MaxLength,
      arguments: [characterLimit],
      message: `Details must be ${characterLimit} characters or less`,
    },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const fields: FormWizard.Fields = {
  accommodation_section_complete: {
    text: 'Is the accommodation section complete?',
    code: 'accommodation_analysis_section_complete',
    type: FieldType.Radio,
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  accommodation_analysis_section_complete: {
    text: 'Is the accommodation analysis section complete?',
    code: 'accommodation_analysis_section_complete',
    type: FieldType.Radio,
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  drug_use_section_complete: {
    text: 'Is the drug use section complete?',
    code: 'drug_use_section_complete',
    type: FieldType.Radio,
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  drug_use_analysis_section_complete: {
    text: 'Is the drug use analysis section complete?',
    code: 'drug_use_analysis_section_complete',
    type: FieldType.Radio,
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  finance_section_complete: {
    text: 'Is the finance section complete?',
    code: 'finance_section_complete',
    type: FieldType.Radio,
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  finance_analysis_section_complete: {
    text: 'Is the finance analysis section complete?',
    code: 'finance_analysis_section_complete',
    type: FieldType.Radio,
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  current_accommodation: {
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
    labelClasses: mediumLabel,
  },
  type_of_settled_accommodation: {
    text: 'Select the type of settled accommodation?',
    code: 'type_of_settled_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the type of settled accommodation' }],
    options: [
      { text: 'Homeowner', value: 'HOMEOWNER', kind: 'option' },
      { text: 'Renting privately', value: 'RENTING_PRIVATELY', kind: 'option' },
      { text: 'Renting from social, local authority or other', value: 'RENTING_OTHER', kind: 'option' },
      { text: 'Living with friends or family', value: 'FRIENDS_OR_FAMILY', kind: 'option' },
      { text: 'Supported accommodation', value: 'SUPPORTED_ACCOMMODATION', kind: 'option' },
      { text: 'Residential healthcare', value: 'RESIDENTIAL_HEALTHCARE', kind: 'option' },
    ],
    dependent: {
      field: 'current_accommodation',
      value: 'SETTLED',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  type_of_temporary_accommodation: {
    text: 'Select the type of temporary accommodation?',
    code: 'type_of_temporary_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the type of temporary accommodation' }],
    options: [
      { text: 'Short term accommodation', value: 'SHORT_TERM', kind: 'option' },
      { text: 'Approved premises', value: 'APPROVED_PREMISES', kind: 'option' },
      { text: 'Community Accommodation Service Tier 2 (CAS2)', value: 'CAS2', kind: 'option' },
      { text: 'Community Accommodation Service Tier 3 (CAS3)', value: 'CAS3', kind: 'option' },
      {
        text: 'Immigration accommodation',
        value: 'IMMIGRATION',
        hint: { html: immigrationAccommodationHint },
        kind: 'option',
      },
    ],
    dependent: {
      field: 'current_accommodation',
      value: 'TEMPORARY',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  short_term_accommodation_end_date: {
    text: 'Enter expected end date (optional)',
    code: 'short_term_accommodation_end_date',
    type: FieldType.Date,
    validate: [
      { type: ValidationType.Required, message: 'Enter a valid date' },
      { fn: futureDateValidator, message: 'Enter a future date' },
    ],
    dependent: {
      field: 'type_of_temporary_accommodation',
      value: 'SHORT_TERM',
      displayInline: true,
    },
  },
  approved_premises_end_date: {
    text: 'Enter expected end date (optional)',
    code: 'approved_premises_end_date',
    type: FieldType.Date,
    validate: [
      { type: ValidationType.Required, message: 'Enter a valid date' },
      { fn: futureDateValidator, message: 'Enter a future date' },
    ],
    dependent: {
      field: 'type_of_temporary_accommodation',
      value: 'APPROVED_PREMISES',
      displayInline: true,
    },
  },
  cas2_end_date: {
    text: 'Enter expected end date (optional)',
    code: 'cas2_end_date',
    type: FieldType.Date,
    validate: [
      { type: ValidationType.Required, message: 'Enter a valid date' },
      { fn: futureDateValidator, message: 'Enter a future date' },
    ],
    dependent: {
      field: 'type_of_temporary_accommodation',
      value: 'CAS2',
      displayInline: true,
    },
  },
  cas3_end_date: {
    text: 'Enter expected end date (optional)',
    code: 'cas3_end_date',
    type: FieldType.Date,
    validate: [
      { type: ValidationType.Required, message: 'Enter a valid date' },
      { fn: futureDateValidator, message: 'Enter a future date' },
    ],
    dependent: {
      field: 'type_of_temporary_accommodation',
      value: 'CAS3',
      displayInline: true,
    },
  },
  immigration_accommodation_end_date: {
    text: 'Enter expected end date (optional)',
    code: 'immigration_accommodation_end_date',
    type: FieldType.Date,
    validate: [
      { type: ValidationType.Required, message: 'Enter a valid date' },
      { fn: futureDateValidator, message: 'Enter a future date' },
    ],
    dependent: {
      field: 'type_of_temporary_accommodation',
      value: 'IMMIGRATION',
      displayInline: true,
    },
  },
  type_of_no_accommodation: {
    text: 'Select the type of accommodation?',
    code: 'type_of_no_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the type of no accommodation' }],
    options: [
      { text: 'Campsite', value: 'CAMPSITE', kind: 'option' },
      { text: 'Shelter', value: 'SHELTER', kind: 'option' },
      { text: 'Rough sleeping', value: 'ROUGH_SLEEPING', kind: 'option' },
      { text: 'Homeless - includes squatting', value: 'HOMELESS', kind: 'option' },
      { text: 'Emergency hostel', value: 'EMERGENCY_HOSTEL', kind: 'option' },
      { text: 'Awaiting assessment', value: 'AWAITING_ASSESSMENT', kind: 'option' },
    ],
    dependent: {
      field: 'current_accommodation',
      value: 'NO_ACCOMMODATION',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  awaiting_assessment_details: {
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
  living_with: {
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
      { text: 'Child under 18 years old', value: 'CHILD_UNDER_18', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
      orDivider,
      { text: 'Alone', value: 'ALONE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  living_with_children_details: {
    text: 'Give details (optional)',
    hint: { text: 'Include name, date of birth or age, gender and their relationship to [subject]', kind: 'text' },
    code: 'living_with_children_details',
    type: FieldType.TextArea,
    dependent: {
      field: 'living_with',
      value: 'CHILD_UNDER_18',
      displayInline: true,
    },
  },
  living_with_partner_details: {
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
  // living_with_children: {
  //   text: 'Placeholder',
  //   code: 'living_with_children',
  //   type: FieldType.Collection,
  //   dependent: {
  //     field: 'living_with',
  //     value: 'CHILD_UNDER_18',
  //     displayInline: true,
  //   },
  // },
  // living_with_partner: {
  //   text: 'Placeholder',
  //   code: 'living_with_partner',
  //   type: FieldType.Collection,
  //   dependent: {
  //     field: 'living_with',
  //     value: 'PARTNER',
  //     displayInline: true,
  //   },
  // },
  living_with_other: {
    text: 'Give details (optional)',
    code: 'living_with_other',
    type: FieldType.TextArea,
    dependent: {
      field: 'living_with',
      value: 'OTHER',
      displayInline: true,
    },
  },
  suitable_housing: {
    text: "Is [subject]'s overall accommodation suitable?",
    code: 'suitable_housing',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if the overall accommodation is suitable' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'Yes, with concerns', value: 'YES_WITH_CONCERNS', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  suitable_housing_concerns: {
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
  suitable_housing_concerns_other_details: {
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
  unsuitable_housing_concerns: {
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
  unsuitable_housing_concerns_other_details: {
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
  suitable_housing_location: {
    text: "Is the location of [subject]'s accommodation suitable?",
    code: 'suitable_housing_location',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if the location of the accommodation is suitable' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  suitable_housing_location_concerns: {
    text: 'What are the concerns with the location?',
    hint: { text: 'Select all that apply (optional)', kind: 'text' },
    code: 'suitable_housing_location_concerns',
    type: FieldType.CheckBox,
    multiple: true,
    options: [
      { text: 'Safety of the area', value: 'AREA_SAFETY', kind: 'option' },
      { text: 'Close to criminal associates', value: 'CRIMINAL_ASSOCIATES', kind: 'option' },
      { text: 'Difficulty with neighbours', value: 'NEIGHBOUR_DIFFICULTY', kind: 'option' },
      { text: 'Close to victim or possible victims', value: 'VICTIM_PROXIMITY', kind: 'option' },
      { text: 'Close to someone who has victimised them', value: 'VICTIMISATION', kind: 'option' },
      { text: 'Honour-based perpetrator or victim', value: 'HONOUR_BASED', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    dependent: {
      field: 'suitable_housing_location',
      value: 'NO',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  suitable_housing_location_concerns_other_details: {
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
  no_accommodation_reason: {
    text: 'Why does [subject] have no accommodation?',
    hint: { html: noAccommodationHint, kind: 'html' },
    code: 'no_accommodation_reason',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select why they have no accommodation' }],
    options: [
      { text: 'Financial difficulties', value: 'FINANCIAL_DIFFICULTIES', kind: 'option' },
      { text: 'Alcohol related problems', value: 'ALCOHOL_PROBLEMS', kind: 'option' },
      { text: 'Drug related problems', value: 'DRUG_PROBLEMS', kind: 'option' },
      { text: 'No accommodation when released from prison', value: 'PRISON_RELEASE', kind: 'option' },
      { text: 'Left previous accommodation for their own safety', value: 'SAFETY', kind: 'option' },
      { text: 'Left previous accommodation due to risk to others', value: 'RISK_TO_OTHERS', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  no_accommodation_reason_other_details: {
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
  past_accommodation_details: {
    text: 'What has helped [subject] stay in accommodation in the past?',
    code: 'past_accommodation_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: "Enter what's helped to stay in accommodation in the past" },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    labelClasses: mediumLabel,
  },
  suitable_housing_planned: {
    text: 'Does [subject] have future accommodation planned?',
    code: 'suitable_housing_planned',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have future accommodation planned' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  future_accommodation_type: {
    text: 'What is the type of future accommodation?',
    code: 'future_accommodation_type',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the type of future accommodation' }],
    options: [
      { text: 'Awaiting assessment', value: 'AWAITING_ASSESSMENT', kind: 'option' },
      { text: 'Awaiting placement', value: 'AWAITING_PLACEMENT', kind: 'option' },
      { text: 'Buying a house', value: 'BUYING_HOUSE', kind: 'option' },
      { text: 'Rent privately', value: 'RENT_PRIVATELY', kind: 'option' },
      { text: 'Rent from social, local authority or other', value: 'RENT_SOCIAL', kind: 'option' },
      { text: 'Living with friends or family', value: 'LIVING_WITH_FRIENDS_OR_FAMILY', kind: 'option' },
      { text: 'Supported accommodation', value: 'SUPPORTED_ACCOMMODATION', kind: 'option' },
      { text: 'Residential healthcare', value: 'RESIDENTIAL_HEALTHCARE', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    dependent: {
      field: 'suitable_housing_planned',
      value: 'YES',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  suitable_housing_planned_awaiting_assessment_details: {
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
  awaiting_accommodation_placement_details: {
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
  suitable_housing_planned_other_details: {
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
  accommodation_changes: {
    text: 'Does [subject] want to make changes to their accommodation?',
    hint: { text: 'This question must be directly answered by [subject]', kind: 'text' },
    code: 'accommodation_changes',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they want to make changes to their accommodation' },
    ],
    options: [
      { text: 'I have already made changes and want to maintain them', value: 'MADE_CHANGES', kind: 'option' },
      { text: 'I am actively making changes', value: 'MAKING_CHANGES', kind: 'option' },
      { text: 'I want to make changes and know how to', value: 'WANT_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I want to make changes but need help', value: 'NEEDS_HELP_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I am thinking about making changes', value: 'THINKING_ABOUT_MAKING_CHANGES', kind: 'option' },
      { text: 'I do not want to make changes', value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I do not want to answer', value: 'DOES_NOT_WANT_TO_ANSWER', kind: 'option' },
      orDivider,
      { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  accommodation_made_changes_details: {
    text: 'Give details',
    code: 'accommodation_made_changes_details',
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
      field: 'accommodation_changes',
      value: 'MADE_CHANGES',
      displayInline: true,
    },
  },
  accommodation_making_changes_details: {
    text: 'Give details',
    code: 'accommodation_making_changes_details',
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
      field: 'accommodation_changes',
      value: 'MAKING_CHANGES',
      displayInline: true,
    },
  },
  accommodation_want_to_make_changes_details: {
    text: 'Give details',
    code: 'accommodation_want_to_make_changes_details',
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
      field: 'accommodation_changes',
      value: 'WANT_TO_MAKE_CHANGES',
      displayInline: true,
    },
  },
  accommodation_needs_help_to_make_changes_details: {
    text: 'Give details',
    code: 'accommodation_needs_help_to_make_changes_details',
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
      field: 'accommodation_changes',
      value: 'NEEDS_HELP_TO_MAKE_CHANGES',
      displayInline: true,
    },
  },
  accommodation_thinking_about_making_changes_details: {
    text: 'Give details',
    code: 'accommodation_thinking_about_making_changes_details',
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
      field: 'accommodation_changes',
      value: 'THINKING_ABOUT_MAKING_CHANGES',
      displayInline: true,
    },
  },
  accommodation_does_not_want_to_make_changes_details: {
    text: 'Give details',
    code: 'accommodation_does_not_want_to_make_changes_details',
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
      field: 'accommodation_changes',
      value: 'DOES_NOT_WANT_TO_MAKE_CHANGES',
      displayInline: true,
    },
  },
  practitioner_analysis_patterns_of_behaviour: {
    text: 'Are there any patterns of behaviours related to this area?',
    hint: {
      text: 'Include repeated circumstances or behaviours.',
      kind: 'text',
    },
    code: 'practitioner_analysis_patterns_of_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any patterns of behaviours' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  practitioner_analysis_patterns_of_behaviour_details: {
    text: 'Give details',
    code: 'practitioner_analysis_patterns_of_behaviour_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  practitioner_analysis_strengths_or_protective_factors: {
    text: 'Are there any strengths or protective factors related to this area?',
    hint: {
      text: 'Include any strategies, people or support networks that helped.',
      kind: 'text',
    },
    code: 'practitioner_analysis_strengths_or_protective_factors',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  practitioner_analysis_strengths_or_protective_factors_details: {
    text: 'Give details',
    code: 'practitioner_analysis_strengths_or_protective_factors_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  practitioner_analysis_risk_of_serious_harm: {
    text: 'Is this an area linked to risk of serious harm?',
    code: 'practitioner_analysis_risk_of_serious_harm',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of serious harm' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  practitioner_analysis_risk_of_serious_harm_details: {
    text: 'Give details',
    code: 'practitioner_analysis_risk_of_serious_harm_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  practitioner_analysis_risk_of_reoffending: {
    text: 'Is this an area linked to risk of reoffending?',
    code: 'practitioner_analysis_risk_of_reoffending',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of reoffending' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  practitioner_analysis_risk_of_reoffending_details: {
    text: 'Give details',
    code: 'practitioner_analysis_risk_of_reoffending_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  practitioner_analysis_related_to_risk: {
    text: 'Is this an area of need which is not related to risk?',
    code: 'practitioner_analysis_related_to_risk',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if an area of need which is not related to risk' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  practitioner_analysis_related_to_risk_details: {
    text: 'Give details',
    code: 'practitioner_analysis_related_to_risk_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  drug_use: {
    text: 'Has [subject] ever used drugs?',
    code: 'drug_use',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have ever used drugs' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  drug_use_changes: {
    text: 'Does [subject] want to make changes to their drug use?',
    code: 'drug_use_changes',
    hint: { text: 'This question must be directly answered by [subject] ', kind: 'text' },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they want to make changes to their drug use' }],
    options: [
      { text: 'I have already made positive changes', value: 'POSITIVE_CHANGE', kind: 'option' },
      { text: 'I am actively making changes', value: 'ACTIVE_CHANGE', kind: 'option' },
      { text: 'I want to make changes and know how to', value: 'KNOWN_CHANGE', kind: 'option' },
      { text: 'I want to make changes but need help', value: 'HELP_CHANGE', kind: 'option' },
      { text: 'I am thinking about making changes', value: 'THINK_CHANGE', kind: 'option' },
      { text: 'I do not want to make changes', value: 'NO_CHANGE', kind: 'option' },
      { text: 'I do not want to answer', value: 'NO_ANSWER_CHANGE', kind: 'option' },
      { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  drug_use_positive_change: {
    text: 'Give details',
    code: 'drug_use_positive_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'POSITIVE_CHANGE',
      displayInline: true,
    },
  },
  drug_use_active_change: {
    text: 'Give details',
    code: 'drug_use_active_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'ACTIVE_CHANGE',
      displayInline: true,
    },
  },
  drug_use_known_change: {
    text: 'Give details',
    code: 'drug_use_known_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'KNOWN_CHANGE',
      displayInline: true,
    },
  },
  drug_use_help_change: {
    text: 'Give details',
    code: 'drug_use_help_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'HELP_CHANGE',
      displayInline: true,
    },
  },
  drug_use_think_change: {
    text: 'Give details',
    code: 'drug_use_think_change:',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'THINK_CHANGE',
      displayInline: true,
    },
  },
  drug_use_no_change: {
    text: 'Give details',
    code: 'drug_use_no_change:',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'NO_CHANGE',
      displayInline: true,
    },
  },
  // child_name: {
  //   text: 'Name',
  //   code: 'child_name',
  //   type: FieldType.Text,
  //   validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  // },
  // child_date_of_birth: {
  //   text: 'Date of birth',
  //   hint: { text: 'For example, 31 3 2011' },
  //   code: 'child_date_of_birth',
  //   type: FieldType.Date,
  //   validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  // },
  // child_age: {
  //   text: 'Age',
  //   code: 'child_age',
  //   type: FieldType.Text,
  //   validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  // },
  // relationship_to_child: {
  //   text: "Select [subject]'s relationship to the child",
  //   code: 'relationship_to_child',
  //   type: FieldType.Radio,
  //   validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  //   options: [
  //     { text: 'Parent or carer', value: 'PARENT_OR_CARER' },
  //     { text: 'Family member', value: 'FAMILY_MEMBER' },
  //     { text: 'Friend', value: 'FRIEND' },
  //     { text: 'Other', value: 'OTHER' },
  //   ],
  // },
  // child_gender: {
  //   text: 'Select gender',
  //   code: 'child_gender',
  //   type: FieldType.Radio,
  //   validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  //   options: [
  //     { text: 'Boy', value: 'BOY' },
  //     { text: 'Girl', value: 'GIRL' },
  //     { text: 'Non-binary', value: 'NON_BINARY' },
  //     { text: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' },
  //   ],
  // },
  // partner_name: {
  //   text: 'Name',
  //   code: 'partner_name',
  //   type: FieldType.Text,
  //   validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  // },
  // partner_age: {
  //   text: 'Age',
  //   code: 'partner_age',
  //   type: FieldType.Text,
  //   validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  // },
  // partner_gender: {
  //   text: 'Select gender',
  //   code: 'partner_gender',
  //   type: FieldType.Radio,
  //   validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  //   options: [
  //     { text: 'Boy', value: 'BOY' },
  //     { text: 'Girl', value: 'GIRL' },
  //     { text: 'Non-binary', value: 'NON_BINARY' },
  //     { text: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' },
  //   ],
  // },
  drug_use_type: {
    text: 'Which drugs have [subject] used?',
    code: 'drug_use_type',
    hint: { text: 'Include current and previous drugs. Select all that apply.', kind: 'text' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select which drugs they have used' }],
    options: [
      { text: 'Amphetamines', value: 'AMPHETAMINES', kind: 'option' },
      { text: 'Benzodiazepines', value: 'BENZODIAZEPINES', kind: 'option' },
      { text: 'Cannabis', value: 'CANNABIS', kind: 'option' },
      { text: 'Cocaine', value: 'COCAINE', kind: 'option' },
      { text: 'Crack', value: 'CRACK', kind: 'option' },
      { text: 'Ecstasy', value: 'ECSTASY', kind: 'option' },
      { text: 'Heroin', value: 'HEROIN', kind: 'option' },
      { text: 'Ketamine (also known as MDMA)', value: 'KETAMINE', kind: 'option' },
      { text: 'Methadone (not prescribed)', value: 'METHADONE_NOT_PRESCRIBED', kind: 'option' },
      { text: 'Methadone (prescribed)', value: 'METHADONE_PRESCRIBED', kind: 'option' },
      { text: 'Non-prescribed medication', value: 'NON_PRESCRIBED_MEDICATION', kind: 'option' },
      { text: 'Psychoactive substances (spice)', value: 'PSYCHOACTIVE_SUBSTANCES_SPICE', kind: 'option' },
      { text: 'Other', value: 'OTHER_DRUG_TYPE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  other_drug_details: {
    text: 'Enter drug name',
    code: 'other_drug_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter drug name' }],
    dependent: {
      field: 'drug_use_type',
      value: 'OTHER_DRUG_TYPE',
      displayInline: true,
    },
  },
  drug_usage_heroin: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_heroin',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'HEROIN'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  daily_injecting_drug_heroin: createInjectingDrug(
    'daily_injecting_drug_heroin',
    'drug_usage_heroin',
    'DAILY',
    'HEROIN',
  ),
  weekly_injecting_drug_heroin: createInjectingDrug(
    'weekly_injecting_drug_heroin',
    'drug_usage_heroin',
    'WEEKLY',
    'HEROIN',
  ),
  monthly_injecting_drug_heroin: createInjectingDrug(
    'monthly_injecting_drug_heroin',
    'drug_usage_heroin',
    'MONTHLY',
    'HEROIN',
  ),
  occasionally_injecting_drug_heroin: createInjectingDrug(
    'occasionally_injecting_drug_heroin',
    'drug_usage_heroin',
    'OCCASIONALLY',
    'HEROIN',
  ),
  daily_drug_usage_treatment_heroin: createReceivingTreatment(
    'daily_drug_usage_treatment_heroin',
    'drug_usage_heroin',
    'DAILY',
    'HEROIN',
  ),
  weekly_drug_usage_treatment_heroin: createReceivingTreatment(
    'weekly_drug_usage_treatment_heroin',
    'drug_usage_heroin',
    'WEEKLY',
    'HEROIN',
  ),
  monthly_drug_usage_treatment_heroin: createReceivingTreatment(
    'monthly_drug_usage_treatment_heroin',
    'drug_usage_heroin',
    'MONTHLY',
    'HEROIN',
  ),
  occasionally_drug_usage_treatment: createReceivingTreatment(
    'occasionally_drug_usage_treatment',
    'drug_usage_heroin',
    'OCCASIONALLY',
    'HEROIN',
  ),
  past_drug_usage_heroin: createPastDrugUsage('past_drug_usage_heroin', 'HEROIN'),
  past_injecting_drug_heroin: createPastInjectingDrug(
    'past_injecting_drug_heroin',
    'past_drug_usage_heroin',
    'YES',
    'HEROIN',
  ),
  drug_usage_methadone_not_prescribed: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_methadone_not_prescribed',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'NON_PRESCRIBED_MEDICATION'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  daily_injecting_drug_methadone_not_prescribed: createInjectingDrug(
    'daily_injecting_drug_methadone_not_prescribed',
    'drug_usage_methadone_not_prescribed',
    'DAILY',
    'METHADONE_NOT_PRESCRIBED',
  ),
  weekly_injecting_drug_methadone_not_prescribed: createInjectingDrug(
    'weekly_injecting_drug_methadone_not_prescribed',
    'drug_usage_methadone_not_prescribed',
    'WEEKLY',
    'METHADONE_NOT_PRESCRIBED',
  ),
  monthly_injecting_drug_methadone_not_prescribed: createInjectingDrug(
    'monthly_injecting_drug_methadone_not_prescribed',
    'drug_usage_methadone_not_prescribed',
    'MONTHLY',
    'METHADONE_NOT_PRESCRIBED',
  ),
  occasionally_injecting_drug_methadone_not_prescribed: createInjectingDrug(
    'occasionally_injecting_drug_methadone_not_prescribed',
    'drug_usage_methadone_not_prescribed',
    'OCCASIONALLY',
    'METHADONE_NOT_PRESCRIBED',
  ),
  past_drug_usage_methadone_not_prescribed: createPastDrugUsage(
    'past_drug_usage_methadone_not_prescribed',
    'METHADONE_NOT_PRESCRIBED',
  ),
  past_injecting_drug_methadone_not_prescribed: createPastInjectingDrug(
    'past_injecting_drug_methadone_not_prescribed',
    'past_drug_usage_methadone_not_prescribed',
    'YES',
    'METHADONE_NOT_PRESCRIBED',
  ),
  drug_usage_crack: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_crack',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'CRACK'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  daily_injecting_drug_crack: createInjectingDrug('daily_injecting_drug_crack', 'drug_usage_crack', 'DAILY', 'CRACK'),
  weekly_injecting_drug_crack: createInjectingDrug(
    'weekly_injecting_drug_crack',
    'drug_usage_crack',
    'WEEKLY',
    'CRACK',
  ),
  monthly_injecting_drug_crack: createInjectingDrug(
    'monthly_injecting_drug_crack',
    'drug_usage_crack',
    'MONTHLY',
    'CRACK',
  ),
  occasionally_injecting_drug_crack: createInjectingDrug(
    'occasionally_injecting_drug_crack',
    'drug_usage_crack',
    'OCCASIONALLY',
    'CRACK',
  ),
  past_drug_usage_crack: createPastDrugUsage('past_drug_usage_crack', 'CRACK'),
  past_injecting_drug_crack: createPastInjectingDrug(
    'past_injecting_drug_crack',
    'past_drug_usage_crack',
    'YES',
    'CRACK',
  ),
  drug_usage_amphetamines: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_amphetamines',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'AMPHETAMINES'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'AMPHETAMINES' },
  },
  daily_injecting_drug_amphetamines: createInjectingDrug(
    'daily_injecting_drug_amphetamines',
    'drug_usage_amphetamines',
    'DAILY',
    'AMPHETAMINES',
  ),
  weekly_injecting_drug_amphetamines: createInjectingDrug(
    'weekly_injecting_drug_amphetamines',
    'drug_usage_amphetamines',
    'WEEKLY',
    'AMPHETAMINES',
  ),
  monthly_injecting_drug_amphetamines: createInjectingDrug(
    'monthly_injecting_drug_amphetamines',
    'drug_usage_amphetamines',
    'MONTHLY',
    'AMPHETAMINES',
  ),
  occasionally_injecting_drug_amphetamines: createInjectingDrug(
    'occasionally_injecting_drug_amphetamines',
    'drug_usage_amphetamines',
    'OCCASIONALLY',
    'AMPHETAMINES',
  ),
  past_drug_usage_amphetamines: createPastDrugUsage('past_drug_usage_amphetamines', 'AMPHETAMINES'),
  past_injecting_drug_amphetamines: createPastInjectingDrug(
    'past_injecting_drug_amphetamines',
    'past_drug_usage_amphetamines',
    'YES',
    'AMPHETAMINES',
  ),
  drug_usage_benzodiazepines: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_benzodiazepines',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'BENZODIAZEPINES'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  daily_injecting_drug_benzodiazepines: createInjectingDrug(
    'daily_injecting_drug_benzodiazepines',
    'drug_usage_benzodiazepines',
    'DAILY',
    'BENZODIAZEPINES',
  ),
  weekly_injecting_drug_benzodiazepines: createInjectingDrug(
    'weekly_injecting_drug_benzodiazepines',
    'drug_usage_benzodiazepines',
    'WEEKLY',
    'BENZODIAZEPINES',
  ),
  monthly_injecting_drug_benzodiazepines: createInjectingDrug(
    'monthly_injecting_drug_benzodiazepines',
    'drug_usage_benzodiazepines',
    'MONTHLY',
    'BENZODIAZEPINES',
  ),
  occasionally_injecting_drug_benzodiazepines: createInjectingDrug(
    'occasionally_injecting_drug_benzodiazepines',
    'drug_usage_benzodiazepines',
    'OCCASIONALLY',
    'BENZODIAZEPINES',
  ),
  past_drug_usage_benzodiazepines: createPastDrugUsage('past_drug_usage_benzodiazepines', 'BENZODIAZEPINES'),
  past_injecting_drug_benzodiazepines: createPastInjectingDrug(
    'past_injecting_drug_benzodiazepines',
    'past_drug_usage_benzodiazepines',
    'YES',
    'BENZODIAZEPINES',
  ),
  drug_usage_other_drug: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_other_drug',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'OTHER_DRUG_TYPE'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  daily_injecting_drug_other_drug: createInjectingDrug(
    'daily_injecting_drug_other_drug',
    'drug_usage_other_drug',
    'DAILY',
    'OTHER_DRUG_TYPE',
  ),
  weekly_injecting_drug_other_drug: createInjectingDrug(
    'weekly_injecting_drug_other_drug',
    'drug_usage_other_drug',
    'WEEKLY',
    'OTHER_DRUG_TYPE',
  ),
  monthly_injecting_drug_other_drug: createInjectingDrug(
    'monthly_injecting_drug_other_drug',
    'drug_usage_other_drug',
    'MONTHLY',
    'OTHER_DRUG_TYPE',
  ),
  occasionally_injecting_drug_other_drug: createInjectingDrug(
    'occasionally_injecting_drug_other_drug',
    'drug_usage_other_drug',
    'OCCASIONALLY',
    'OTHER_DRUG_TYPE',
  ),
  past_drug_usage_other_drug: createPastDrugUsage('past_drug_usage_other_drug', 'OTHER_DRUG_TYPE'),
  past_injecting_drug_other_drug: createPastInjectingDrug(
    'past_injecting_drug_other_drug',
    'past_drug_usage_other_drug',
    'YES',
    'OTHER_DRUG_TYPE',
  ),
  drug_usage_cannabis: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_cannabis',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'CANNABIS'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  past_drug_usage_cannabis: createPastDrugUsage('past_drug_usage_cannabis', 'CANNABIS'),
  drug_usage_cocaine: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_cocaine',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'COCAINE'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  past_drug_usage_cocaine: createPastDrugUsage('past_drug_usage_cocaine', 'COCAINE'),
  drug_usage_ecstasy: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_ecstasy',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'ECSTASY'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  past_drug_usage_ecstasy: createPastDrugUsage('past_drug_usage_ecstasy', 'ECSTASY'),
  drug_usage_ketamine: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_ketamine',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'KETAMINE'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  past_drug_usage_ketamine: createPastDrugUsage('past_drug_usage_ketamine', 'KETAMINE'),
  drug_usage_methadone_prescribed: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_methadone_prescribed',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'METHADONE_PRESCRIBED'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  past_drug_usage_methadone_prescribed: createPastDrugUsage(
    'past_drug_usage_methadone_prescribed',
    'METHADONE_PRESCRIBED',
  ),
  drug_usage_non_prescribed_medication: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_non_prescribed_medication',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'NON_PRESCRIBED_MEDICATION'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  past_drug_usage_non_prescribed_medication: createPastDrugUsage(
    'past_drug_usage_non_prescribed_medication',
    'NON_PRESCRIBED_MEDICATION',
  ),
  drug_usage_psychoactive_substances: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_psychoactive_substances',
    type: FieldType.Radio,
    validate: [
      {
        fn: createRequiredIfCollectionContainsWith('drug_use_type', 'PSYCHOACTIVE_SUBSTANCES_SPICE'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      orDivider,
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  past_drug_usage_psychoactive_substances: createPastDrugUsage(
    'past_drug_usage_psychoactive_substances',
    'PSYCHOACTIVE_SUBSTANCES_SPICE',
  ),
  drug_use_reasons: {
    text: 'Why did [subject] start using drugs?',
    hint: { text: 'Consider their history and any triggers of drug use. Select all that apply', kind: 'text' },
    code: 'drug_use_reasons',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select why they started using drugs' }],
    options: [
      { text: 'Recreation or pleasure', value: 'RECREATION_PLEASURE', kind: 'option' },
      { text: 'Curiosity or experimentation', value: 'CURIOSITY_EXPERIMENTATION', kind: 'option' },
      { text: 'Manage stress or emotional issues', value: 'STRESS_EMOTIONAL_ISSUES', kind: 'option' },
      { text: 'Self-medication for pain', value: 'SELF_MEDICATION_PAIN', kind: 'option' },
      { text: 'Manage withdrawal symptoms', value: 'MANAGE_WITHDRAWAL', kind: 'option' },
      { text: 'Peer pressure or social influence', value: 'SOCIAL_PEER_PRESSURE', kind: 'option' },
      { text: 'Enhance performance', value: 'ENHANCE_PERFORMANCE', kind: 'option' },
      { text: 'Escapism or avoidance', value: 'ESCAPISM_AVOIDANCE', kind: 'option' },
      { text: 'Cultural or religious practices', value: 'CULTURAL_RELIGIOUS', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  drug_use_reason_details: {
    text: 'Give details',
    code: 'drug_use_reason_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_reasons',
      value: 'OTHER',
      displayInline: true,
    },
  },
  drug_use_impact: {
    text: "What's the impact of [subject] using drugs?",
    hint: { text: 'Select all that apply', kind: 'text' },
    code: 'drug_use_impact',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select the impact of them using drugs' }],
    options: [
      {
        text: 'Physical or mental health',
        value: 'PHYSICAL_MENTAL_HEALTH',
        hint: { text: 'Includes overdose.' },
        kind: 'option',
      },
      {
        text: 'Relationships',
        value: 'RELATIONSHIPS',
        hint: { text: 'Includes isolation or neglecting responsibilities.' },
        kind: 'option',
      },
      { text: 'Finances', value: 'FINANCES', hint: { text: 'Includes having no money.' }, kind: 'option' },
      {
        text: 'Community',
        value: 'COMMUNITY',
        hint: { text: 'Includes limited opportunities or judgement from others.' },
        kind: 'option',
      },
      {
        text: 'Behavioural',
        value: 'BEHAVIOURAL',
        hint: { text: 'Includes unemployment, disruption on education or lack of productivity.' },
        kind: 'option',
      },
      { text: 'Links to offending', value: 'OFFENDING', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  drug_use_impact_details: {
    text: 'Give details',
    hint: { text: 'Consider impact on themselves or others.', kind: 'text' },
    code: 'drug_use_impact_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_impact',
      value: 'OTHER',
      displayInline: true,
    },
  },
  reducing_or_stopping_drug_use: {
    text: 'Has anything helped [subject] to stop or reduce using drugs in the past?',
    code: 'reducing_or_stopping_drug_use',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if anything has helped them to stop or reduce using drugs in the past',
      },
    ],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  reducing_or_stopping_drug_use_details: {
    text: 'Give details',
    code: 'reducing_or_stopping_drug_use_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'reducing_or_stopping_drug_use',
      value: 'YES',
      displayInline: true,
    },
  },
  motivated_stopping_drug_use: {
    text: 'Is [subject] motivated to stop or reduce their drug use?',
    code: 'motivated_stopping_drug_use',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they are motivated to stop or reduce their drug use' },
    ],
    options: [
      { text: 'Does not show motivation to stop or reduce', value: 'NO_MOTIVATION', kind: 'option' },
      { text: 'Shows some motivation to stop or reduce', value: 'SOME_MOTIVATION', kind: 'option' },
      { text: 'Motivated to stop or reduce', value: 'MOTIVATED', kind: 'option' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  patterns_or_behaviours: {
    text: 'Are there any patterns or behaviours related to this area?',
    hint: { text: 'Include repeated circumstances or behaviours.', kind: 'text' },
    code: 'patterns_or_behaviours',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any patterns of behaviours' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  patterns_or_behaviours_yes_details: {
    text: 'Give details',
    code: 'patterns_or_behaviours_yes_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
    dependent: {
      field: 'patterns_or_behaviours',
      value: 'YES',
      displayInline: true,
    },
  },
  patterns_or_behaviours_no_details: {
    text: 'Give details',
    code: 'patterns_or_behaviours_no_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
    dependent: {
      field: 'patterns_or_behaviours',
      value: 'NO',
      displayInline: true,
    },
  },
  strengths_or_protective_factors: {
    text: 'Are there any strengths or protective factors related to this area?',
    hint: { text: 'Include any strategies, people or support networks that helped.', kind: 'text' },
    code: 'strengths_or_protective_factors',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  strengths_or_protective_factors_yes_details: {
    text: 'Give details',
    code: 'strengths_or_protective_factors_yes_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
    dependent: {
      field: 'strengths_or_protective_factors',
      value: 'YES',
      displayInline: true,
    },
  },
  strengths_or_protective_factors_no_details: {
    text: 'Give details',
    code: 'strengths_or_protective_factors_no_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
    dependent: {
      field: 'strengths_or_protective_factors',
      value: 'NO',
      displayInline: true,
    },
  },
  linked_to_risk_of_serious_harm: {
    text: 'Is this an area linked to risk of serious harm?',
    code: 'linked_to_risk_of_serious_harm',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of serious harm' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  linked_to_risk_of_serious_harm_yes_details: {
    text: 'Give details',
    code: 'linked_to_risk_of_serious_harm_yes_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
    dependent: {
      field: 'linked_to_risk_of_serious_harm',
      value: 'YES',
      displayInline: true,
    },
  },
  linked_to_risk_of_serious_harm_no_details: {
    text: 'Give details',
    code: 'linked_to_risk_of_serious_harm_no_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
    dependent: {
      field: 'linked_to_risk_of_serious_harm',
      value: 'NO',
      displayInline: true,
    },
  },
  linked_to_risk_of_reoffending: {
    text: 'Is this an area linked to risk of reoffedning?',
    code: 'linked_to_risk_of_reoffending',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of reoffending' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  linked_to_risk_of_reoffending_yes_details: {
    text: 'Give details',
    code: 'linked_to_risk_of_reoffending_yes_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
    dependent: {
      field: 'linked_to_risk_of_reoffending',
      value: 'YES',
      displayInline: true,
    },
  },
  linked_to_risk_of_reoffending_no_details: {
    text: 'Give details',
    code: 'linked_to_risk_of_reoffending_no_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
    dependent: {
      field: 'linked_to_risk_of_reoffending',
      value: 'NO',
      displayInline: true,
    },
  },
  not_related_to_risk: {
    text: 'Is this an area of need which is not related to risk?',
    code: 'not_related_to_risk',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if an area of need which is not related to risk' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  not_related_to_risk_yes_details: {
    text: 'Give details',
    code: 'not_related_to_risk_yes_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
    dependent: {
      field: 'not_related_to_risk',
      value: 'YES',
      displayInline: true,
    },
  },
  not_related_to_risk_no_details: {
    text: 'Give details',
    code: 'not_related_to_risk_no_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
    dependent: {
      field: 'not_related_to_risk',
      value: 'NO',
      displayInline: true,
    },
  },
  finance_income: {
    text: 'Where does [subject] get their money from? ',
    code: 'finance_income',
    hint: { text: 'Select all that apply', kind: 'text' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'error message' }],
    options: [
      { text: 'Employment', value: 'EMPLOYMENT', kind: 'option' },
      { text: 'Student loan', value: 'STUDENT_LOAN', kind: 'option' },
      { text: 'Pension', value: 'PENSION', kind: 'option' },
      {
        text: 'Work related benefits',
        value: 'WORK_RELATED_BENEFITS',
        hint: { text: "For example, Universal Credit or Jobseeker's Allowance (JSA)." },
        kind: 'option',
      },
      {
        text: 'Disability benefits',
        value: 'DISABILITY_BENEFITS',
        hint: {
          text: 'For example, Personal Independence Payment (PIP) (also known as Disability Living Allowance) or Severe Disablement Allowance.',
        },
        kind: 'option',
      },
      { text: "Carer's allowance", value: 'CARERS_ALLOWANCE', kind: 'option' },
      { text: 'Family or Friends', value: 'FAMILY_OR_FRIENDS', kind: 'option' },
      { text: 'Undeclared (includes cash in hand)', value: 'Undeclared', kind: 'option' },
      { text: 'Offending', value: 'OFFENDING', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
      orDivider,
      { text: 'No money', value: 'NO_MONEY', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  family_or_friends_details: {
    text: 'Is [subject] over reliant on family or friends for money?',
    code: 'family_or_friends_details',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    dependent: {
      field: 'finance_income',
      value: 'FAMILY_OR_FRIENDS',
      displayInline: true,
    },
  },
  other_income_details: {
    text: 'Give details',
    code: 'other_income_details',
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
      field: 'finance_income',
      value: 'OTHER',
      displayInline: true,
    },
  },
  finance_bank_account: {
    text: 'Does [subject] have a personal bank account?',
    code: 'finance_bank_account',
    hint: { text: 'This does not include solely having a joint account.', kind: 'text' },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  finance_money_management: {
    text: 'How good is [subject] at managing their money?',
    code: 'finance_money_management',
    hint: { text: 'This includes things like budgeting, prioritising bills and paying rent..', kind: 'text' },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      {
        text: 'Good',
        value: 'GOOD',
        hint: { text: 'Able to manage their money well and is a strength.' },
        kind: 'option',
      },
      {
        text: 'Fairly good',
        value: 'FAIRLY_GOOD',
        hint: { text: 'Able to manage their money for everyday necessities.' },
        kind: 'option',
      },
      {
        text: 'Fairly bad',
        value: 'FAIRLY_BAD',
        hint: { text: 'Unable to manage their money well.' },
        kind: 'option',
      },
      {
        text: 'Bad',
        value: 'BAD',
        hint: { text: 'Unable to manage their money which is creating other problems.' },
        kind: 'option',
      },
    ],
    labelClasses: mediumLabel,
  },
  good_money_management_details: {
    text: 'Give details',
    code: 'good_money_management_details',
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
      field: 'finance_money_management',
      value: 'GOOD',
      displayInline: true,
    },
  },
  fairly_good_money_management_details: {
    text: 'Give details',
    code: 'fairly_good_money_management_details',
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
      field: 'finance_money_management',
      value: 'FAIRLY_GOOD',
      displayInline: true,
    },
  },
  fairly_bad_money_management_details: {
    text: 'Give details',
    code: 'fairly_bad_money_management_details',
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
      field: 'finance_money_management',
      value: 'FAIRLY_BAD',
      displayInline: true,
    },
  },
  bad_money_management_details: {
    text: 'Give details',
    code: 'bad_money_management_details',
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
      field: 'finance_money_management',
      value: 'BAD',
      displayInline: true,
    },
  },
  finance_gambling: {
    text: 'Is [subject] affected by gambling?',
    code: 'finance_gambling',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      {
        text: 'Yes, their own gambling',
        value: 'YES_THEIR_GAMBLING',
        kind: 'option',
      },
      {
        text: "Yes, someone else's gambling",
        value: 'YES_SOMEONE_ELSES_GAMBLING',
        kind: 'option',
      },
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
      },
      {
        text: 'Unknown',
        value: 'UNKNOWN',
        kind: 'option',
      },
    ],
    labelClasses: mediumLabel,
  },
  yes_their_gambling_details: {
    text: 'Give details (optional)',
    code: 'yes_their_gambling_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_gambling',
      value: 'YES_THEIR_GAMBLING',
      displayInline: true,
    },
  },
  yes_someone_elses_gambling_details: {
    text: 'Give details (optional)',
    code: 'yes_someone_elses_gambling_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_gambling',
      value: 'YES_SOMEONE_ELSES_GAMBLING',
      displayInline: true,
    },
  },
  no_gambling_details: {
    text: 'Give details (optional)',
    code: 'no_gambling_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_gambling',
      value: 'NO',
      displayInline: true,
    },
  },
  unknown_gambling_details: {
    text: 'Give details (optional)',
    code: 'unknown_gambling_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_gambling',
      value: 'UNKNOWN',
      displayInline: true,
    },
  },
  finance_debt: {
    text: 'Is [subject] affected by debt?',
    code: 'finance_debt',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      {
        text: 'Yes, their own debt',
        value: 'YES_THEIR_DEBT',
        kind: 'option',
      },
      {
        text: "Yes, someone else's debt",
        value: 'YES_SOMEONE_ELSES_DEBT',
        kind: 'option',
      },
      {
        text: 'Unknown',
        value: 'UNKNOWN',
        kind: 'option',
      },
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: mediumLabel,
  },
  yes_type_of_debt: createDebtType('yes_type_of_debt', 'finance_debt', 'YES_THEIR_DEBT'),
  yes_formal_debt_details: createFormalDebtDetails('yes_formal_debt_details', 'yes_type_of_debt', 'FORMAL_DEBT'),
  yes_debt_to_others_details: createDebtToOthersDetails(
    'yes_debt_to_others_details',
    'yes_type_of_debt',
    'DEBT_TO_OTHERS',
  ),
  yes_formal_debt_to_others_details: createFormalAndDebtOthersDetails(
    'yes_formal_debt_to_others_details',
    'yes_type_of_debt',
    'FORMAL_AND_DEBT_TO_OTHERS',
  ),
  yes_someone_elses_type_of_debt: createDebtType(
    'yes_someone_elses_type_of_debt',
    'finance_debt',
    'YES_SOMEONE_ELSES_DEBT',
  ),
  yes_someone_elses_formal_debt_details: createFormalDebtDetails(
    'yes_someone_elses_formal_debt_details',
    'yes_someone_elses_type_of_debt',
    'FORMAL_DEBT',
  ),
  yes_someone_elses_debt_to_others_details: createDebtToOthersDetails(
    'yes_someone_elses_debt_to_others_details',
    'yes_someone_elses_type_of_debt',
    'DEBT_TO_OTHERS',
  ),
  yes__someone_elses_formal_debt_to_others_details: createFormalAndDebtOthersDetails(
    'yes__someone_elses_formal_debt_to_others_details',
    'yes_someone_elses_type_of_debt',
    'FORMAL_AND_DEBT_TO_OTHERS',
  ),
  unknown_debt_details: {
    text: 'Give details (optional)',
    code: 'unknown_debt_details',
    hint: { text: "Consider if they might have debt due to a partner or family member's finances.", kind: 'text' },
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_debt',
      value: 'UNKNOWN',
      displayInline: true,
    },
  },
  changes_to_finance: {
    text: 'Does [subject] want to make changes to their finance?',
    hint: { text: 'This question must be directly answered by [subject].', kind: 'text' },
    code: 'changes_to_finance',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      {
        text: 'I have already made positive changes and want to maintain them',
        value: 'POSITIVE_CHANGES',
        kind: 'option',
      },
      {
        text: 'I am actively making changes',
        value: 'ACTIVE_CHANGE',
        kind: 'option',
      },
      {
        text: 'I want to make changes and know how to',
        value: 'KNOWN_CHANGES',
        kind: 'option',
      },
      {
        text: 'I want to make changes but need help',
        value: 'MAKE_CHANGES_HELP',
        kind: 'option',
      },
      {
        text: 'I am thinking about making changes',
        value: 'THINKING_CHANGES',
        kind: 'option',
      },
      {
        text: 'I do not want to make changes',
        value: 'NO_CHANGES',
        kind: 'option',
      },
      {
        text: 'I do not want to answer',
        value: 'NO_ANSWER',
        kind: 'option',
      },
      orDivider,
      { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  finance_positive_change_details: {
    text: 'Give details',
    code: 'finance_positive_change_details',
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
      field: 'changes_to_finance',
      value: 'POSITIVE_CHANGES',
      displayInline: true,
    },
  },
  finance_active_change_details: {
    text: 'Give details',
    code: 'finance_active_change_details',
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
      field: 'changes_to_finance',
      value: 'ACTIVE_CHANGE',
      displayInline: true,
    },
  },
  finance_known_change_details: {
    text: 'Give details',
    code: 'finance_known_change_details',
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
      field: 'changes_to_finance',
      value: 'KNOWN_CHANGES',
      displayInline: true,
    },
  },
  finance_help_change_details: {
    text: 'Give details',
    code: 'finance_help_change_details',
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
      field: 'changes_to_finance',
      value: 'MAKE_CHANGES_HELP',
      displayInline: true,
    },
  },
  finance_thinking_change_details: {
    text: 'Give details',
    code: 'finance_thinking_change_details',
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
      field: 'changes_to_finance',
      value: 'THINKING_CHANGES',
      displayInline: true,
    },
  },
  finance_no_change_details: {
    text: 'Give details',
    code: 'finance_no_change_details',
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
      field: 'changes_to_finance',
      value: 'NO_CHANGES',
      displayInline: true,
    },
  },
  finance_practitioner_analysis_patterns_of_behaviour: {
    text: 'Are there any patterns of behaviours related to this area?',
    hint: {
      text: 'Include repeated circumstances or behaviours.',
      kind: 'text',
    },
    code: 'finance_practitioner_analysis_patterns_of_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any patterns of behaviours' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  finance_practitioner_analysis_patterns_of_behaviour_details: {
    text: 'Give details',
    code: 'finance_practitioner_analysis_patterns_of_behaviour_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  finance_practitioner_analysis_strengths_or_protective_factors: {
    text: 'Are there any strengths or protective factors related to this area?',
    hint: {
      text: 'Include any strategies, people or support networks that helped.',
      kind: 'text',
    },
    code: 'finance_practitioner_analysis_strengths_or_protective_factors',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  finance_practitioner_analysis_strengths_or_protective_factors_details: {
    text: 'Give details',
    code: 'finance_practitioner_analysis_strengths_or_protective_factors_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  finance_practitioner_analysis_risk_of_serious_harm: {
    text: 'Is this an area linked to risk of serious harm?',
    code: 'finance_practitioner_analysis_risk_of_serious_harm',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of serious harm' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  finance_practitioner_analysis_risk_of_serious_harm_details: {
    text: 'Give details',
    code: 'finance_practitioner_analysis_risk_of_serious_harm_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  finance_practitioner_analysis_risk_of_reoffending: {
    text: 'Is this an area linked to risk of reoffending?',
    code: 'finance_practitioner_analysis_risk_of_reoffending',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of reoffending' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  finance_practitioner_analysis_risk_of_reoffending_details: {
    text: 'Give details',
    code: 'finance_practitioner_analysis_risk_of_reoffending_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  finance_practitioner_analysis_related_to_risk: {
    text: 'Is this an area of need which is not related to risk?',
    code: 'finance_practitioner_analysis_related_to_risk',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if an area of need which is not related to risk' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  finance_practitioner_analysis_related_to_risk_details: {
    text: 'Give details',
    code: 'finance_practitioner_analysis_related_to_risk_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
}
export default fields
