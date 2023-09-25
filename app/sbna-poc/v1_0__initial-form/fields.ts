import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import { DateTime, Interval } from 'luxon'

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

const characterLimit = 400

const fields: FormWizard.Fields = {
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
  },
  living_with_children_details: {
    text: 'Give details (optional)',
    code: 'living_with_children_details',
    type: FieldType.TextArea,
    dependent: {
      field: 'living_with',
      value: 'CHILD_UNDER_18',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  living_with_partner_details: {
    text: 'Give details (optional)',
    code: 'living_with_partner_details',
    type: FieldType.TextArea,
    dependent: {
      field: 'living_with',
      value: 'PARTNER',
      displayInline: true,
    },
    useSmallLabel: true,
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
    useSmallLabel: true,
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
  },
  suitable_housing_concerns: {
    text: 'Select all that apply (optional)',
    code: 'suitable_housing_concerns',
    type: FieldType.CheckBox,
    multiple: true,
    options: suitableHousingConcernsOptions,
    dependent: {
      field: 'suitable_housing',
      value: 'YES_WITH_CONCERNS',
      displayInline: true,
    },
    useSmallLabel: true,
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
    useSmallLabel: true,
  },
  unsuitable_housing_concerns: {
    text: 'Select all that apply (optional)',
    code: 'unsuitable_housing_concerns',
    type: FieldType.CheckBox,
    multiple: true,
    options: suitableHousingConcernsOptions,
    dependent: {
      field: 'suitable_housing',
      value: 'NO',
      displayInline: true,
    },
    useSmallLabel: true,
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
    useSmallLabel: true,
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
  },
  suitable_housing_location_concerns: {
    text: 'Select all that apply (optional)',
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
    useSmallLabel: true,
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
    useSmallLabel: true,
  },
  no_accommodation_reason: {
    text: 'Why does [subject] have no accommodation?',
    hint: { text: 'Consider current and past homelessness issues', kind: 'text' },
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
  },
  suitable_housing_planned_other_details: {
    text: 'Give details',
    hint: { text: 'Include where and who with', kind: 'text' },
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
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
    useSmallLabel: true,
  },
  accommodation_practitioner_analysis: {
    text: 'Practitioner analysis',
    hint: {
      text: 'Include any strengths, needs or risks which may link to risk of serious harm or risk of reoffending.',
      kind: 'text',
    },
    code: 'accommodation_practitioner_analysis',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    characterCountMax: 4000,
  },
  accommodation_serious_harm: {
    text: "Is [subject]'s accommodation linked to risk of serious harm?",
    code: 'accommodation_serious_harm',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'yes', kind: 'option' },
      { text: 'No', value: 'no', kind: 'option' },
    ],
    characterCountMax: 4000,
  },
  accommodation_risk_of_reoffending: {
    text: "Is [subject]'s accommodation linked to risk of reoffending?",
    code: 'accommodation_risk_of_reoffending',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'yes', kind: 'option' },
      { text: 'No', value: 'no', kind: 'option' },
    ],
    characterCountMax: 4000,
  },
  drug_use: {
    text: 'Has [subject] ever used drugs?',
    code: 'drug_use',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Drug use is required' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  drug_use_changes: {
    text: 'Does [subject] want to make changes to their drug use?',
    code: 'drug_use_changes',
    hint: { text: 'This question must be directly answered by [subject] ', kind: 'text' },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Drug use change field is required' }],
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
  },
  drug_use_positive_change: {
    text: 'Give details',
    code: 'drug_use_positive_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'POSITIVE_CHANGE',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  drug_use_active_change: {
    text: 'Give details',
    code: 'drug_use_active_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'ACTIVE_CHANGE',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  drug_use_known_change: {
    text: 'Give details',
    code: 'drug_use_known_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'KNOWN_CHANGE',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  drug_use_help_change: {
    text: 'Give details',
    code: 'drug_use_help_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'HELP_CHANGE',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  drug_use_think_change: {
    text: 'Give details',
    code: 'drug_use_think_change:',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'THINK_CHANGE',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  drug_use_no_change: {
    text: 'Give details',
    code: 'drug_use_no_change:',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'NO_CHANGE',
      displayInline: true,
    },
    useSmallLabel: true,
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
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Amphetamines', value: 'AMPHETAMINES', kind: 'option' },
      { text: 'Benzodiazepines', value: 'BENZODIAZEPINES', kind: 'option' },
      { text: 'Cannabis', value: 'CANNABIS', kind: 'option' },
      { text: 'Cocaine', value: 'COCAINE', kind: 'option' },
      { text: 'Crack', value: 'CRACK', kind: 'option' },
      { text: 'Ecstasy', value: 'ECSTASY', kind: 'option' },
      { text: 'Heroin', value: 'HEROIN', kind: 'option' },
      { text: 'Methadone (not prescribed)', value: 'METHADONE_NOT_PRESCRIBED', kind: 'option' },
      { text: 'Methadone (prescribed)', value: 'METHADONE_PRESCRIBED', kind: 'option' },
      { text: 'Non-prescribed medication', value: 'NON_PRESCRIBED_MEDICATION', kind: 'option' },
      { text: 'Psychoactive substances (spice)', value: 'PSYCHOACTIVE_SUBSTANCES_SPICE', kind: 'option' },
      { text: 'Other', value: 'OTHER_DRUG_TYPE', kind: 'option' },
    ],
  },
  drug_usage: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
  },
  drug_usage_heroin: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_heroin',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Daily', value: 'DAILY', kind: 'option' },
      { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
      { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
      { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
      { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
    ],
  },
  daily_drug_usage_treatment: {
    text: 'Is [subject] receiving treatment?',
    code: 'daily_drug_usage_treatment',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    dependent: {
      field: 'drug_usage_heroin',
      value: 'DAILY',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  weekly_drug_usage_treatment: {
    text: 'Is [subject] receiving treatment?',
    code: 'weekly_drug_usage_treatment',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    dependent: {
      field: 'drug_usage_heroin',
      value: 'WEEKLY',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  monthly_drug_usage_treatment: {
    text: 'Is [subject] receiving treatment?',
    code: 'monthly_drug_usage_treatment',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    dependent: {
      field: 'drug_usage_heroin',
      value: 'MONTHLY',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  occasionally_drug_usage_treatment: {
    text: 'Is [subject] receiving treatment?',
    code: 'occasionally_drug_usage_treatment',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    dependent: {
      field: 'drug_usage_heroin',
      value: 'OCCASIONALLY',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  drug_past_usage: {
    text: 'Has [subject] used this drug in the past?',
    code: 'drug_past_usage',
    type: FieldType.CheckBox,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  drug_use_reasons: {
    text: 'Why did [subject] start using drugs?',
    hint: { text: 'Consider their history and any triggers of drug use. Select all that apply', kind: 'text' },
    code: 'drug_use_reasons',
    type: FieldType.CheckBox,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
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
  },
  drug_use_reason_details: {
    text: 'Give details',
    code: 'drug_use_reason_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'drug_use_reasons',
      value: 'OTHER',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  drug_use_impact: {
    text: "What's the impact of [subject] using drugs?",
    hint: { text: 'Select all that apply', kind: 'text' },
    code: 'drug_use_impact',
    type: FieldType.CheckBox,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
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
  },
  drug_use_impact_details: {
    text: 'Give details',
    hint: { text: 'Consider impact on themselves or others.', kind: 'text' },
    code: 'drug_use_impact_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'drug_use_impact',
      value: 'OTHER',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  reducing_or_stopping_drug_use: {
    text: 'Has anything helped [subject] to stop or reduce using drugs in the past?',
    code: 'reducing_or_stopping_drug_use',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
  },
  reducing_or_stopping_drug_use_details: {
    text: 'Give details',
    code: 'reducing_or_stopping_drug_use_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'reducing_or_stopping_drug_use',
      value: 'YES',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  motivated_stopping_drug_use: {
    text: 'Is [subject] motivated to stop or reduce their drug use?',
    code: 'motivated_stopping_drug_use',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Does not show motivation to stop or reduce', value: 'NO_MOTIVATION', kind: 'option' },
      { text: 'Shows some motivation to stop or reduce', value: 'SOME_MOTIVATION', kind: 'option' },
      { text: 'Motivated to stop or reduce', value: 'MOTIVATED', kind: 'option' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
    ],
  },
  patterns_or_behaviours: {
    text: 'Are there any patterns or behaviours related to this area?',
    hint: 'Include repeated circumstances or behaviours.',
    code: 'patterns_or_behaviours',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES' },
      { text: 'No', value: 'NO' },
    ],
  },
  patterns_or_behaviours_yes_details: {
    text: 'Give details',
    code: 'patterns_or_behaviours_yes_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'patterns_or_behaviours',
      value: 'YES',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  patterns_or_behaviours_no_details: {
    text: 'Give details',
    code: 'patterns_or_behaviours_no_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'patterns_or_behaviours',
      value: 'NO',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  strengths_or_protective_factors: {
    text: 'Are there any strengths or protective factors related to this area?',
    hint: 'Include any strategies, people or support networks that helped.',
    code: 'strengths_or_protective_factors',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES' },
      { text: 'No', value: 'NO' },
    ],
  },
  strengths_or_protective_factors_yes_details: {
    text: 'Give details',
    code: 'strengths_or_protective_factors_yes_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'strengths_or_protective_factors',
      value: 'YES',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  strengths_or_protective_factors_no_details: {
    text: 'Give details',
    code: 'strengths_or_protective_factors_no_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'strengths_or_protective_factors',
      value: 'NO',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  linked_to_risk_of_serious_harm: {
    text: 'Is this an area linked to risk of serious harm?',
    code: 'linked_to_risk_of_serious_harm',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES' },
      { text: 'No', value: 'NO' },
    ],
  },
  linked_to_risk_of_serious_harm_yes_details: {
    text: 'Give details',
    code: 'linked_to_risk_of_serious_harm_yes_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'linked_to_risk_of_serious_harm',
      value: 'YES',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  linked_to_risk_of_serious_harm_no_details: {
    text: 'Give details',
    code: 'linked_to_risk_of_serious_harm_no_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'linked_to_risk_of_serious_harm',
      value: 'NO',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  linked_to_risk_of_reoffending: {
    text: 'Is this an area linked to risk of reoffedning?',
    code: 'linked_to_risk_of_reoffending',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES' },
      { text: 'No', value: 'NO' },
    ],
  },
  linked_to_risk_of_reoffending_yes_details: {
    text: 'Give details',
    code: 'linked_to_risk_of_reoffending_yes_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'linked_to_risk_of_reoffending',
      value: 'YES',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  linked_to_risk_of_reoffending_no_details: {
    text: 'Give details',
    code: 'linked_to_risk_of_reoffending_no_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'linked_to_risk_of_reoffending',
      value: 'NO',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  not_related_to_risk: {
    text: 'Is this an area of need which is not related to risk?',
    code: 'not_related_to_risk',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES' },
      { text: 'No', value: 'NO' },
    ],
  },
  not_related_to_risk_yes_details: {
    text: 'Give details',
    code: 'not_related_to_risk_yes_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'not_related_to_risk',
      value: 'YES',
      displayInline: true,
    },
    useSmallLabel: true,
  },
  not_related_to_risk_no_details: {
    text: 'Give details',
    code: 'not_related_to_risk_no_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'not_related_to_risk',
      value: 'NO',
      displayInline: true,
    },
    useSmallLabel: true,
  },
}
export default fields
