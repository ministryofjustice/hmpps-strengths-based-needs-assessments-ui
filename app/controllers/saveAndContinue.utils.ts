import FormWizard from 'hmpo-form-wizard'
import { AnswerDto, AnswerDTOs, UpdateAnswersDto } from '../../server/services/strengthsBasedNeedsService'
import { Field, FieldDependencyTreeBuilder } from '../utils/fieldDependencyTreeBuilder'
import { whereSelectable } from '../utils/field.utils'
import { FieldType } from '../../server/@types/hmpo-form-wizard/enums'
import { HandoverPrincipal } from '../../server/services/arnsHandoverService'

export const toAnswerDtoOption = ({ value, text }: FormWizard.Field.Option) => ({ value, text })

export const createAnswerDTOs =
  (answers: FormWizard.Answers) =>
  (answerDTOs: AnswerDTOs, field: Field): AnswerDTOs => {
    const formWizardField = field.field
    const thisAnswer = answers[formWizardField.id || formWizardField.code]

    switch (formWizardField.type) {
      case FieldType.CheckBox:
        return {
          ...answerDTOs,
          [formWizardField.code]: {
            type: formWizardField.type,
            description: formWizardField.text,
            options: formWizardField.options.filter(whereSelectable).map(toAnswerDtoOption),
            values: thisAnswer as string[],
          },
        }
      case FieldType.Radio:
        return {
          ...answerDTOs,
          [formWizardField.code]: {
            type: formWizardField.type,
            description: formWizardField.text,
            options: formWizardField.options.filter(whereSelectable).map(toAnswerDtoOption),
            value: thisAnswer as string,
          },
        }
      default:
        return {
          ...answerDTOs,
          [formWizardField.code]: {
            type: formWizardField.type,
            description: formWizardField.text,
            value: thisAnswer as string,
          },
        }
    }
  }

export const buildRequestBody = (
  formOptions: FormWizard.FormOptions,
  answers: FormWizard.Answers,
  options: { removeOrphanAnswers?: boolean } = {},
): UpdateAnswersDto => {
  const relevantFields = new FieldDependencyTreeBuilder(formOptions, answers).buildAndFlatten()
  const { removeOrphanAnswers = true } = options

  const sectionFields = Object.values(formOptions.steps)
    .filter(step => step.section === formOptions.section)
    .reduce((acc: string[], step) => [...acc, ...Object.values(step.fields).map(f => f.code)], [])

  return {
    answersToAdd: relevantFields
      .filter(f => Object.keys(formOptions.fields).includes(f.field.id))
      .reduce(createAnswerDTOs(answers), {}),
    answersToRemove: removeOrphanAnswers
      ? Object.keys(answers).filter(
          fieldCode =>
            sectionFields.includes(fieldCode) && !relevantFields.some(field => field.field.code === fieldCode),
        )
      : [],
  }
}

export const flattenAnswers = (answers: Record<string, AnswerDto>) =>
  Object.entries(answers).reduce(
    (allAnswers, [key, answer]) => ({
      ...allAnswers,
      [key]: answer.type === FieldType.CheckBox ? answer.values : answer.value,
    }),
    {},
  )

export const isReadOnly = (user: HandoverPrincipal) => user.accessMode === 'READ_ONLY'
