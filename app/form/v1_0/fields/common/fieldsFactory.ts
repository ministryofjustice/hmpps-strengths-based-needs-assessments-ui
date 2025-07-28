import FormWizard from 'hmpo-form-wizard'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import {
  dependentOn,
  fieldCodeWith,
  getMediumLabelClassFor,
  orDivider,
  validateMaxLength,
  yesNoOptions,
} from './fieldUtils'
import characterLimits from '../../config/characterLimits'

type Section = {
  title: string
  code: string
}

type DetailsFieldOptions = {
  text?: string
  parentField: FormWizard.Field
  dependentValue?: string
  required?: boolean
  requiredMessage?: string
  maxChars?: number
  textHint?: string
  htmlHint?: string
}

export default abstract class FieldsFactory {
  section: Section

  fieldPrefix: string

  constructor(section: Section) {
    this.section = section
    this.fieldPrefix = section.code.replace(/-/g, '_')
  }

  static getUserSubmittedField(fields: string[]): string {
    return fields.filter(field => field.endsWith('_user_submitted'))[0]
  }

  static detailsFieldWith(options: DetailsFieldOptions) {
    return (option: FormWizard.Field.Option): FormWizard.Field =>
      this.detailsField({ ...options, dependentValue: option.value })
  }

  static detailsField(options: DetailsFieldOptions): FormWizard.Field {
    const maxChars = options.maxChars ? options.maxChars : characterLimits.default
    const field: FormWizard.Field = {
      text: (options.text ? options.text : 'Give details') + (options.required ? '' : ' (optional)'),
      code: fieldCodeWith(
        ...[options.parentField.code, options.dependentValue?.toLowerCase(), 'details'].filter(it => it),
      ),
      type: FieldType.TextArea,
      validate: [
        options.required
          ? {
              type: ValidationType.Required,
              message: options.requiredMessage ? options.requiredMessage : 'Enter details',
            }
          : null,
        {
          type: 'validateMaxLength',
          fn: validateMaxLength,
          arguments: [maxChars],
          message: `Details must be ${maxChars} characters or less`,
        },
      ].filter(Boolean),
    }
    if (options.dependentValue === 'WEAPON') {
      field.type = FieldType.Text
      field.validate[0].message = `Weapon must be ${maxChars} characters or less`
    }
    if (options.dependentValue) {
      field.dependent = dependentOn(options.parentField, options.dependentValue)
    }
    if (options.textHint) {
      field.hint = { text: options.textHint, kind: 'text' }
    }
    if (options.htmlHint) {
      field.hint = { html: options.htmlHint, kind: 'html' }
    }
    return field
  }

  isUserSubmitted(step: string): FormWizard.Field {
    const stepCode = step.replace(/-/g, '_').replace(/\//g, '')
    return {
      text: 'Has the user submitted the page?',
      code: `${this.fieldPrefix}_is_${stepCode}_user_submitted`,
      type: FieldType.Radio,
      hidden: true,
      options: yesNoOptions,
    }
  }

  sectionComplete(): FormWizard.Field {
    return {
      text: `Is the ${this.section.title} section complete?`,
      code: `${this.fieldPrefix}_section_complete`,
      type: FieldType.Radio,
      hidden: true,
      options: yesNoOptions,
    }
  }

  wantToMakeChanges(): Array<FormWizard.Field> {
    const changesTo = `their ${this.section.title.toLowerCase()}`

    const makeChangesOptionsWithDetails: Array<FormWizard.Field.Option> = [
      { text: 'I have already made positive changes and want to maintain them', value: 'MADE_CHANGES', kind: 'option' },
      { text: 'I am actively making changes', value: 'MAKING_CHANGES', kind: 'option' },
      { text: 'I want to make changes and know how to', value: 'WANT_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I want to make changes but need help', value: 'NEEDS_HELP_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I am thinking about making changes', value: 'THINKING_ABOUT_MAKING_CHANGES', kind: 'option' },
      { text: 'I do not want to make changes', value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I do not want to answer', value: 'DOES_NOT_WANT_TO_ANSWER', kind: 'option' },
    ]

    const parentField: FormWizard.Field = {
      text: `Does [subject] want to make changes to ${changesTo}?`,
      hint: { text: '[subject] must answer this question.', kind: 'text' },
      code: `${this.fieldPrefix}_changes`,
      type: FieldType.Radio,
      validate: [{ type: ValidationType.Required, message: `Select if they want to make changes to ${changesTo}` }],
      options: [
        ...makeChangesOptionsWithDetails,
        orDivider,
        { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
        { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
      ],
      labelClasses: getMediumLabelClassFor(FieldType.Radio),
    }

    return [parentField, ...makeChangesOptionsWithDetails.map(FieldsFactory.detailsFieldWith({ parentField }))]
  }

  practitionerAnalysis(): Array<FormWizard.Field> {
    const sectionDisplayName = this.section.title.toLowerCase()
    const subjectPrefix = sectionDisplayName.endsWith('s') ? 'Are' : 'Is'

    const strengthsOrProtectiveFactorsField: FormWizard.Field = {
      text: `Are there any strengths or protective factors related to [subject]'s ${sectionDisplayName}?`,
      hint: {
        text: 'Include any strategies, people or support networks that helped.',
        kind: 'text',
      },
      code: `${this.fieldPrefix}_practitioner_analysis_strengths_or_protective_factors`,
      type: FieldType.Radio,
      validate: [{ type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' }],
      options: yesNoOptions,
      labelClasses: getMediumLabelClassFor(FieldType.Radio),
    }

    const riskOfSeriousHarmField: FormWizard.Field = {
      text: `${subjectPrefix} [subject]'s ${sectionDisplayName} linked to risk of serious harm?`,
      code: `${this.fieldPrefix}_practitioner_analysis_risk_of_serious_harm`,
      type: FieldType.Radio,
      validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of serious harm' }],
      options: yesNoOptions,
      labelClasses: getMediumLabelClassFor(FieldType.Radio),
    }

    const riskOfReoffendingField: FormWizard.Field = {
      text: `${subjectPrefix} [subject]'s ${sectionDisplayName} linked to risk of reoffending?`,
      code: `${this.fieldPrefix}_practitioner_analysis_risk_of_reoffending`,
      type: FieldType.Radio,
      validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of reoffending' }],
      options: yesNoOptions,
      labelClasses: getMediumLabelClassFor(FieldType.Radio),
    }

    return [
      strengthsOrProtectiveFactorsField,
      FieldsFactory.detailsField({
        parentField: strengthsOrProtectiveFactorsField,
        dependentValue: 'YES',
        requiredMessage: `Give details on strengths or protective factors related to their ${sectionDisplayName}`,
        required: true,
        maxChars: characterLimits.c1425,
      }),
      FieldsFactory.detailsField({
        parentField: strengthsOrProtectiveFactorsField,
        dependentValue: 'NO',
        maxChars: characterLimits.c1425,
      }),
      riskOfSeriousHarmField,
      FieldsFactory.detailsField({
        parentField: riskOfSeriousHarmField,
        dependentValue: 'YES',
        requiredMessage: 'Give details on the risk of serious harm',
        required: true,
        maxChars: characterLimits.c1425,
      }),
      FieldsFactory.detailsField({
        parentField: riskOfSeriousHarmField,
        dependentValue: 'NO',
        maxChars: characterLimits.c1425,
      }),
      riskOfReoffendingField,
      FieldsFactory.detailsField({
        parentField: riskOfReoffendingField,
        dependentValue: 'YES',
        requiredMessage: 'Give details on the risk of reoffending',
        required: true,
        maxChars: characterLimits.c1000,
      }),
      FieldsFactory.detailsField({
        parentField: riskOfReoffendingField,
        dependentValue: 'NO',
        maxChars: characterLimits.c1000,
      }),
    ]
  }
}
