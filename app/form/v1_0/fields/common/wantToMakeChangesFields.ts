import FormWizard from 'hmpo-form-wizard'
import { getMediumLabelClassFor, orDivider } from '../common'
import { detailsFieldWith } from './detailsField'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'

const makeChangesOptionsWithDetails: Array<FormWizard.Field.Option> = [
  { text: 'I have already made positive changes and want to maintain them', value: 'MADE_CHANGES', kind: 'option' },
  { text: 'I am actively making changes', value: 'MAKING_CHANGES', kind: 'option' },
  { text: 'I want to make changes and know how to', value: 'WANT_TO_MAKE_CHANGES', kind: 'option' },
  { text: 'I want to make changes but need help', value: 'NEEDS_HELP_TO_MAKE_CHANGES', kind: 'option' },
  { text: 'I am thinking about making changes', value: 'THINKING_ABOUT_MAKING_CHANGES', kind: 'option' },
  { text: 'I do not want to make changes', value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', kind: 'option' },
]

export const createWantToMakeChangesFields = (changesTo: string, prefix: string): Array<FormWizard.Field> => [
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
  ...makeChangesOptionsWithDetails.map(detailsFieldWith({ parentFieldCode: `${prefix}_changes` })),
]
