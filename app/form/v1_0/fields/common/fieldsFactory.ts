import FormWizard from 'hmpo-form-wizard'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import {
  fieldCodeWith,
  getMediumLabelClassFor,
  inlineRadios,
  orDivider,
  requiredWhenValidator,
  summaryCharacterLimit,
  yesNoOptions,
} from './utils'

type Section = {
  title: string
  code: string
}

type DetailsFieldOptions = {
  parentFieldCode: string
  dependentValue?: string
  required?: boolean
  maxChars?: number
  textHint?: string
  htmlHint?: string
}

export default abstract class FieldsFactory {
  static readonly detailsCharacterLimit = 400

  section: Section

  constructor(section: Section) {
    this.section = section
  }

  static getUserSubmittedField(fields: string[]) {
    return fields.filter(field => field.endsWith('_user_submitted'))[0]
  }

  static detailsFieldWith(options: DetailsFieldOptions) {
    return (option: FormWizard.Field.Option): FormWizard.Field =>
      this.detailsField({ ...options, dependentValue: option.value })
  }

  static detailsField(options: DetailsFieldOptions): FormWizard.Field {
    const maxChars = options.maxChars ? options.maxChars : this.detailsCharacterLimit
    const field: FormWizard.Field = {
      text: `Give details${options.required ? '' : ' (optional)'}`,
      code: fieldCodeWith(
        ...[options.parentFieldCode, options.dependentValue?.toLowerCase(), 'details'].filter(it => it),
      ),
      type: FieldType.TextArea,
      validate: [
        options.required ? { type: ValidationType.Required, message: 'Enter details' } : null,
        {
          type: ValidationType.MaxLength,
          arguments: [maxChars],
          message: `Details must be ${maxChars} characters or less`,
        },
      ].filter(it => it),
    }
    if (options.dependentValue) {
      field.dependent = {
        field: options.parentFieldCode,
        value: options.dependentValue,
        displayInline: true,
      }
    }
    if (options.textHint) {
      field.hint = { text: options.textHint, kind: 'text' }
    }
    if (options.htmlHint) {
      field.hint = { html: options.htmlHint, kind: 'html' }
    }
    return field
  }

  isUserSubmitted(step: string): Array<FormWizard.Field> {
    const stepCode = step.replace('-', '_').replace('/', '')
    return [
      {
        text: 'Has the user submitted the page?',
        code: `${this.section.code}_is_${stepCode}_user_submitted`,
        type: FieldType.Radio,
        hidden: true,
        options: yesNoOptions,
      },
    ]
  }

  sectionComplete(): Array<FormWizard.Field> {
    return [
      {
        text: `Is the ${this.section.title} section complete?`,
        code: `${this.section.code}_section_complete`,
        type: FieldType.Radio,
        hidden: true,
        options: yesNoOptions,
      },
    ]
  }

  wantToMakeChanges(): Array<FormWizard.Field> {
    const changesTo = `their ${this.section.title.toLowerCase()}`
    const prefix = this.section.code

    const makeChangesOptionsWithDetails: Array<FormWizard.Field.Option> = [
      { text: 'I have already made positive changes and want to maintain them', value: 'MADE_CHANGES', kind: 'option' },
      { text: 'I am actively making changes', value: 'MAKING_CHANGES', kind: 'option' },
      { text: 'I want to make changes and know how to', value: 'WANT_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I want to make changes but need help', value: 'NEEDS_HELP_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I am thinking about making changes', value: 'THINKING_ABOUT_MAKING_CHANGES', kind: 'option' },
      { text: 'I do not want to make changes', value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', kind: 'option' },
    ]

    return [
      {
        text: `Does [subject] want to make changes to ${changesTo}?`,
        hint: { text: 'This question must be directly answered by [subject].', kind: 'text' },
        code: `${prefix}_changes`,
        type: FieldType.Radio,
        validate: [{ type: ValidationType.Required, message: `Select if they want to make changes to ${changesTo}` }],
        options: [
          ...makeChangesOptionsWithDetails,
          { text: 'I do not want to answer', value: 'DOES_NOT_WANT_TO_ANSWER', kind: 'option' },
          orDivider,
          { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
          { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
        ],
        labelClasses: getMediumLabelClassFor(FieldType.Radio),
      },
      ...makeChangesOptionsWithDetails.map(FieldsFactory.detailsFieldWith({ parentFieldCode: `${prefix}_changes` })),
    ]
  }

  practitionerAnalysis(): Array<FormWizard.Field> {
    const prefix = this.section.code
    const sectionDisplayName = this.section.title
    const analysisRadioGroupClasses = `${inlineRadios} radio-group--analysis`

    return [
      {
        text: `Are there any strengths or protective factors related to [subject]'s ${sectionDisplayName}?`,
        hint: {
          text: 'Include any strategies, people or support networks that helped.',
          kind: 'text',
        },
        code: `${prefix}_practitioner_analysis_strengths_or_protective_factors`,
        type: FieldType.Radio,
        validate: [
          { type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' },
        ],
        options: yesNoOptions,
        classes: analysisRadioGroupClasses,
        labelClasses: getMediumLabelClassFor(FieldType.Radio),
        formGroupClasses: 'no-margin-bottom',
      },
      {
        text: 'Give details',
        code: `${prefix}_practitioner_analysis_strengths_or_protective_factors_details`,
        type: FieldType.TextArea,
        validate: [
          {
            fn: requiredWhenValidator(`${prefix}_practitioner_analysis_strengths_or_protective_factors`, 'YES'),
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
      {
        text: `Is [subject]’s ${sectionDisplayName} linked to risk of serious harm?`,
        code: `${prefix}_practitioner_analysis_risk_of_serious_harm`,
        type: FieldType.Radio,
        validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of serious harm' }],
        options: yesNoOptions,
        classes: analysisRadioGroupClasses,
        labelClasses: getMediumLabelClassFor(FieldType.Radio),
        formGroupClasses: 'no-margin-bottom',
      },
      {
        text: 'Give details',
        code: `${prefix}_practitioner_analysis_risk_of_serious_harm_details`,
        type: FieldType.TextArea,
        validate: [
          {
            fn: requiredWhenValidator(`${prefix}_practitioner_analysis_risk_of_serious_harm`, 'YES'),
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
      {
        text: `Is [subject]’s ${sectionDisplayName} linked to risk of reoffending?`,
        code: `${prefix}_practitioner_analysis_risk_of_reoffending`,
        type: FieldType.Radio,
        validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of reoffending' }],
        options: yesNoOptions,
        classes: analysisRadioGroupClasses,
        labelClasses: getMediumLabelClassFor(FieldType.Radio),
        formGroupClasses: 'no-margin-bottom',
      },
      {
        text: 'Give details',
        code: `${prefix}_practitioner_analysis_risk_of_reoffending_details`,
        type: FieldType.TextArea,
        validate: [
          {
            fn: requiredWhenValidator(`${prefix}_practitioner_analysis_risk_of_reoffending`, 'YES'),
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
    ]
  }
}
