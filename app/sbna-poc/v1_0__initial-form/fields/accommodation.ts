import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  characterLimit,
  futureDateValidator,
  inlineRadios,
  mediumLabel,
  orDivider,
  requiredWhen,
  summaryCharacterLimit,
  visuallyHidden,
  yesNoOptions,
} from './common'

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

function livingWithValidator() {
  const answers = this.values.living_with || []
  return !(answers.includes('ALONE') && answers.length > 1)
}

const fields: FormWizard.Fields = {
  accommodation_section_complete: {
    text: 'Is the accommodation section complete?',
    code: 'accommodation_section_complete',
    type: FieldType.Radio,
    options: yesNoOptions,
  },
  accommodation_analysis_section_complete: {
    text: 'Is the accommodation analysis section complete?',
    code: 'accommodation_analysis_section_complete',
    type: FieldType.Radio,
    options: yesNoOptions,
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
    options: yesNoOptions,
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
    options: yesNoOptions,
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
  accommodation_practitioner_analysis_patterns_of_behaviour: {
    text: 'Are there any patterns of behaviours related to this area?',
    hint: {
      text: 'Include repeated circumstances or behaviours.',
      kind: 'text',
    },
    code: 'accommodation_practitioner_analysis_patterns_of_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any patterns of behaviours' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: inlineRadios,
  },
  accommodation_practitioner_analysis_patterns_of_behaviour_details: {
    text: 'Give details',
    code: 'accommodation_practitioner_analysis_patterns_of_behaviour_details',
    type: FieldType.TextArea,
    validate: [
      {
        fn: requiredWhen('accommodation_practitioner_analysis_patterns_of_behaviour', 'YES'),
        message: 'Enter details',
      },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  accommodation_practitioner_analysis_strengths_or_protective_factors: {
    text: 'Are there any strengths or protective factors related to this area?',
    hint: {
      text: 'Include any strategies, people or support networks that helped.',
      kind: 'text',
    },
    code: 'accommodation_practitioner_analysis_strengths_or_protective_factors',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: inlineRadios,
  },
  accommodation_practitioner_analysis_strengths_or_protective_factors_details: {
    text: 'Give details',
    code: 'accommodation_practitioner_analysis_strengths_or_protective_factors_details',
    type: FieldType.TextArea,
    validate: [
      {
        fn: requiredWhen('accommodation_practitioner_analysis_strengths_or_protective_factors', 'YES'),
        message: 'Enter details',
      },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  accommodation_practitioner_analysis_risk_of_serious_harm: {
    text: 'Is this an area linked to risk of serious harm?',
    code: 'accommodation_practitioner_analysis_risk_of_serious_harm',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of serious harm' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: inlineRadios,
  },
  accommodation_practitioner_analysis_risk_of_serious_harm_details: {
    text: 'Give details',
    code: 'accommodation_practitioner_analysis_risk_of_serious_harm_details',
    type: FieldType.TextArea,
    validate: [
      { fn: requiredWhen('accommodation_practitioner_analysis_risk_of_serious_harm', 'YES'), message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  accommodation_practitioner_analysis_risk_of_reoffending: {
    text: 'Is this an area linked to risk of reoffending?',
    code: 'accommodation_practitioner_analysis_risk_of_reoffending',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of reoffending' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: inlineRadios,
  },
  accommodation_practitioner_analysis_risk_of_reoffending_details: {
    text: 'Give details',
    code: 'accommodation_practitioner_analysis_risk_of_reoffending_details',
    type: FieldType.TextArea,
    validate: [
      { fn: requiredWhen('accommodation_practitioner_analysis_risk_of_reoffending', 'YES'), message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  accommodation_practitioner_analysis_related_to_risk: {
    text: 'Is this an area of need which is not related to risk?',
    code: 'accommodation_practitioner_analysis_related_to_risk',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if an area of need which is not related to risk' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: inlineRadios,
  },
  accommodation_practitioner_analysis_related_to_risk_details: {
    text: 'Give details',
    code: 'accommodation_practitioner_analysis_related_to_risk_details',
    type: FieldType.TextArea,
    validate: [
      { fn: requiredWhen('accommodation_practitioner_analysis_related_to_risk', 'YES'), message: 'Enter details' },
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
