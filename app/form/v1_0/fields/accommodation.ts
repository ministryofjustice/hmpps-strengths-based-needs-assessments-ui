import FormWizard from 'hmpo-form-wizard'
import { FieldsFactory, utils } from './common'
import { FieldType, ValidationType } from '../../../../server/@types/hmpo-form-wizard/enums'
import sections from '../config/sections'
import { dependentOn } from './common/utils'
import { formatDateForDisplay } from '../../../utils/formatters'
import characterLimits from '../config/characterLimits'

const immigrationAccommodationHint = `
    <div class="govuk-grid-column-full">
      <p class="govuk-hint">This includes:</p>
      <ul class="govuk-hint govuk-list govuk-list--bullet">
        <li class=" govuk-!-margin-bottom-5">Schedule 10 - Home Office provides accommodation under the Immigration Act 2016</li>
        <li>Schedule 4 - Home Office provides accommodation for those on immigration bail, prior to the Immigration Act 2016</li>
      </ul>
    </div>
  `

const noAccommodationHint = `
  <div class="govuk-!-width-two-thirds">
    <p class="govuk-hint">Consider current and past homelessness issues.</p>
    <p class="govuk-hint">Select all that apply.</p>
  </div>
`

const suitableHousingConcernsOptions: FormWizard.Field.Options = [
  {
    text: 'Issues with the property - for example, poor kitchen or bathroom facilities',
    value: 'FACILITIES',
    kind: 'option',
  },
  { text: 'Overcrowding', value: 'OVERCROWDING', kind: 'option' },
  {
    text: 'Risk of their accommodation being exploited by others - for example, cuckooing',
    value: 'EXPLOITATION',
    kind: 'option',
  },
  { text: 'Safety of accommodation', value: 'SAFETY', kind: 'option' },
  { text: 'Victim lives with them', value: 'LIVES_WITH_VICTIM', kind: 'option' },
  { text: 'Victimised by someone living with them', value: 'VICTIMISATION', kind: 'option' },
  { text: 'Other', value: 'OTHER', kind: 'option' },
]

export function livingWithValidator() {
  const answers = this.values.living_with || []
  return !(answers.includes('ALONE') && answers.length > 1)
}

const endDateSummaryDisplay = (value: string) => `Expected end date:\n${formatDateForDisplay(value) || 'Not provided'}`

class AccommodationFieldsFactory extends FieldsFactory {
  currentAccommodation: FormWizard.Field = {
    text: 'What type of accommodation does [subject] currently have?',
    code: 'current_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the type of accommodation they currently have' }],
    options: [
      { text: 'Settled', value: 'SETTLED', kind: 'option' },
      { text: 'Temporary', value: 'TEMPORARY', kind: 'option' },
      { text: 'No accommodation', value: 'NO_ACCOMMODATION', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
  }

  typeOfSettledAccommodation: FormWizard.Field = {
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
    dependent: dependentOn(this.currentAccommodation, 'SETTLED'),
    labelClasses: utils.visuallyHidden,
  }

  typeOfTemporaryAccommodation: FormWizard.Field = {
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
      {
        text: 'Short term accommodation',
        value: 'SHORT_TERM',
        hint: { text: 'Includes living with friends or family' },
        kind: 'option',
      },
    ],
    dependent: dependentOn(this.currentAccommodation, 'TEMPORARY'),
    labelClasses: utils.visuallyHidden,
  }

  shortTermAccommodationEndDate: FormWizard.Field = {
    text: 'Enter expected end date (optional)',
    code: 'short_term_accommodation_end_date',
    type: FieldType.Date,
    validate: [
      { fn: utils.validateValidDate, message: 'Enter a valid date' },
      { fn: utils.validateFutureDate, message: 'Enter a future date' },
    ],
    dependent: dependentOn(this.typeOfTemporaryAccommodation, 'SHORT_TERM'),
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
  }

  approvedPremisesEndDate: FormWizard.Field = {
    text: 'Enter expected end date (optional)',
    code: 'approved_premises_end_date',
    type: FieldType.Date,
    validate: [
      { fn: utils.validateValidDate, message: 'Enter a valid date' },
      { fn: utils.validateFutureDate, message: 'Enter a future date' },
    ],
    dependent: dependentOn(this.typeOfTemporaryAccommodation, 'APPROVED_PREMISES'),
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
  }

  cas2EndDate: FormWizard.Field = {
    text: 'Enter expected end date (optional)',
    code: 'cas2_end_date',
    type: FieldType.Date,
    validate: [
      { fn: utils.validateValidDate, message: 'Enter a valid date' },
      { fn: utils.validateFutureDate, message: 'Enter a future date' },
    ],
    dependent: dependentOn(this.typeOfTemporaryAccommodation, 'CAS2'),
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
  }

  cas3EndDate: FormWizard.Field = {
    text: 'Enter expected end date (optional)',
    code: 'cas3_end_date',
    type: FieldType.Date,
    validate: [
      { fn: utils.validateValidDate, message: 'Enter a valid date' },
      { fn: utils.validateFutureDate, message: 'Enter a future date' },
    ],
    dependent: dependentOn(this.typeOfTemporaryAccommodation, 'CAS3'),
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
  }

  immigrationAccommodationEndDate: FormWizard.Field = {
    text: 'Enter expected end date (optional)',
    code: 'immigration_accommodation_end_date',
    type: FieldType.Date,
    validate: [
      { fn: utils.validateValidDate, message: 'Enter a valid date' },
      { fn: utils.validateFutureDate, message: 'Enter a future date' },
    ],
    dependent: dependentOn(this.typeOfTemporaryAccommodation, 'IMMIGRATION'),
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
  }

  typeOfNoAccommodation: FormWizard.Field = {
    text: 'Select the type of accommodation?',
    code: 'type_of_no_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the type of no accommodation' }],
    options: [
      { text: 'Campsite', value: 'CAMPSITE', kind: 'option' },
      { text: 'Emergency hostel', value: 'EMERGENCY_HOSTEL', kind: 'option' },
      { text: 'Homeless - includes squatting', value: 'HOMELESS', kind: 'option' },
      { text: 'Rough sleeping', value: 'ROUGH_SLEEPING', kind: 'option' },
      { text: 'Shelter', value: 'SHELTER', kind: 'option' },
    ],
    dependent: dependentOn(this.currentAccommodation, 'NO_ACCOMMODATION'),
    labelClasses: utils.visuallyHidden,
  }

  livingWith: FormWizard.Field = {
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
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
      utils.orDivider,
      { text: 'Alone', value: 'ALONE', kind: 'option', behaviour: 'exclusive' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  livingWithDetailsGroup: FormWizard.Field[] = [
    ['PARTNER', 'Include name, age and gender.'],
    ['OTHER', null],
  ].map(([option, hint]) =>
    FieldsFactory.detailsField({
      parentField: this.livingWith,
      dependentValue: option,
      textHint: hint,
    }),
  )

  suitableHousingLocation: FormWizard.Field = {
    text: "Is the location of [subject]'s accommodation suitable?",
    code: 'suitable_housing_location',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if the location of the accommodation is suitable' }],
    options: utils.yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  suitableHousingLocationConcerns: FormWizard.Field = {
    text: 'What are the concerns with the location?',
    hint: { text: 'Select all that apply (optional).', kind: 'text' },
    code: 'suitable_housing_location_concerns',
    type: FieldType.CheckBox,
    multiple: true,
    options: [
      { text: 'Close to criminal associates', value: 'CRIMINAL_ASSOCIATES', kind: 'option' },
      { text: 'Close to someone who has victimised them', value: 'VICTIMISATION', kind: 'option' },
      { text: 'Close to victim or possible victims', value: 'VICTIM_PROXIMITY', kind: 'option' },
      { text: 'Difficulty with neighbours', value: 'NEIGHBOUR_DIFFICULTY', kind: 'option' },
      { text: 'Safety of the area', value: 'AREA_SAFETY', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    dependent: dependentOn(this.suitableHousingLocation, 'NO'),
    labelClasses: utils.visuallyHidden,
  }

  suitableHousingLocationConcernsDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.suitableHousingLocationConcerns,
    dependentValue: 'OTHER',
    required: true,
  })

  suitableHousing: FormWizard.Field = {
    text: "Is [subject]'s accommodation suitable?",
    hint: { text: 'This includes things like safety or having appropriate amenities.', kind: 'text' },
    code: 'suitable_housing',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if the accommodation is suitable' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'Yes, with concerns', value: 'YES_WITH_CONCERNS', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  suitableHousingConcerns: FormWizard.Field = {
    text: 'What are the concerns?',
    hint: { text: 'Select all that apply (optional).', kind: 'text' },
    code: 'suitable_housing_concerns',
    type: FieldType.CheckBox,
    multiple: true,
    options: suitableHousingConcernsOptions,
    dependent: dependentOn(this.suitableHousing, 'YES_WITH_CONCERNS'),
    labelClasses: utils.visuallyHidden,
  }

  suitableHousingConcernsDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.suitableHousingConcerns,
    dependentValue: 'OTHER',
    required: true,
  })

  unsuitableHousingConcerns: FormWizard.Field = {
    text: 'What are the concerns?',
    hint: { text: 'Select all that apply (optional).', kind: 'text' },
    code: 'unsuitable_housing_concerns',
    type: FieldType.CheckBox,
    multiple: true,
    options: suitableHousingConcernsOptions,
    dependent: {
      field: 'suitable_housing',
      value: 'NO',
      displayInline: true,
    },
    labelClasses: utils.visuallyHidden,
  }

  unsuitableHousingConcernsDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.unsuitableHousingConcerns,
    dependentValue: 'OTHER',
    required: true,
  })

  suitableHousingPlanned: FormWizard.Field = {
    text: 'Does [subject] have future accommodation planned?',
    code: 'suitable_housing_planned',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have future accommodation planned' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  futureAccommodationType: FormWizard.Field = {
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
    labelClasses: utils.visuallyHidden,
  }

  futureAccommodationTypeDetailsGroup: FormWizard.Field[] = [
    ['AWAITING_ASSESSMENT'],
    ['AWAITING_PLACEMENT'],
    ['OTHER', 'Include where and who with.'],
  ].map(([option, hint]) =>
    FieldsFactory.detailsField({
      parentField: this.futureAccommodationType,
      dependentValue: option,
      textHint: hint,
      required: true,
    }),
  )

  noAccommodationReason: FormWizard.Field = {
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
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  noAccommodationReasonDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.noAccommodationReason,
    dependentValue: 'OTHER',
    required: true,
  })

  pastAccommodationDetails: FormWizard.Field = {
    text: "What's helped [subject] stay in accommodation in the past? (optional)",
    code: 'past_accommodation_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: 'validateMaxLength',
        fn: utils.validateMaxLength,
        arguments: [characterLimits.default],
        message: `Details must be ${characterLimits.default} characters or less`,
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }
}

export default new AccommodationFieldsFactory(sections.accommodation)
