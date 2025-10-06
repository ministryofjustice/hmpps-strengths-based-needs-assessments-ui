import FormWizard from 'hmpo-form-wizard'
import { AnswerDto, AnswerDTOs, UpdateAnswersDto } from '../../server/services/strengthsBasedNeedsService'
import { FieldDependencyTreeBuilder } from '../utils/fieldDependencyTreeBuilder'
import { dependencyMet, whereSelectable } from '../utils/field.utils'
import { FieldType } from '../../server/@types/hmpo-form-wizard/enums'

export const toAnswerDtoOption = ({ value, text }: FormWizard.Field.Option) => ({ value, text })

const createAnswerDtoFromEntry = (
  field: FormWizard.Field,
  entry: FormWizard.CollectionEntry,
): Record<string, AnswerDto> => {
  const entryFields = field.collection.fields
    .filter(f => dependencyMet(f, entry))
    .map(f => [f.code, createAnswerDto(f, entry[f.code])])

  return Object.fromEntries(entryFields)
}

const createCollectionAnswerDto = (field: FormWizard.Field, entries: FormWizard.CollectionEntry[] = []) =>
  entries.map(e => createAnswerDtoFromEntry(field, e))

export const createAnswerDto = (field: FormWizard.Field, answer: FormWizard.Answer): AnswerDto => {
  switch (field.type) {
    case FieldType.CheckBox:
      return {
        type: field.type,
        description: field.text,
        options: field.options.filter(whereSelectable).map(toAnswerDtoOption),
        values: answer as string[],
      }
    case FieldType.Radio:
    case FieldType.Dropdown:
    case FieldType.AutoComplete:
      return {
        type: field.type,
        description: field.text,
        options: field.options.filter(whereSelectable).map(toAnswerDtoOption),
        value: answer as string,
      }
    case FieldType.Collection:
      return {
        type: field.type,
        description: field.text,
        collection: createCollectionAnswerDto(field, answer as FormWizard.CollectionEntry[]),
      }
    default:
      return {
        type: field.type,
        description: field.text,
        value: answer as string,
      }
  }
}

export const createAnswerDTOs =
  (answers: FormWizard.Answers) =>
  (allAnswers: AnswerDTOs, field: FormWizard.Field): AnswerDTOs => {
    const answer = answers[field.id || field.code]

    const answerDto = createAnswerDto(field, answer)

    return {
      ...allAnswers,
      [field.code]: answerDto,
    }
  }

export const buildRequestBody = (
  formOptions: FormWizard.FormOptions,
  answers: FormWizard.Answers,
  options: { removeOrphanAnswers?: boolean } = {},
): UpdateAnswersDto => {
  const relevantFields = new FieldDependencyTreeBuilder(formOptions, answers).getAllNestedFieldsInSectionFromSteps()
  const { removeOrphanAnswers = true } = options

  const sectionFields = Object.values(formOptions.steps)
    .filter(step => step.section === formOptions.section)
    .reduce((acc: string[], step) => [...acc, ...Object.values(step.fields).map(f => f.code)], [])

  return {
    answersToAdd: relevantFields
      .filter(it => Object.keys(formOptions.fields).includes(it.field.id) && it.field.type !== FieldType.Collection)
      .map(it => it.field)
      .reduce(createAnswerDTOs(answers), {}),
    answersToRemove: removeOrphanAnswers
      ? Object.keys(answers).filter(
          fieldCode =>
            sectionFields.includes(fieldCode) && !relevantFields.some(field => field.field.code === fieldCode),
        )
      : [],
    userDetails: {
      id: 'user-id',
      name: 'User Name',
      type: 'SAN',
    },
  }
}

export const flattenAnswers = (answers: Record<string, AnswerDto>): FormWizard.Answers =>
  Object.entries(answers).reduce((allAnswers, [key, answer]) => {
    let data

    switch (answer.type) {
      case FieldType.Collection:
        data = answer.collection.map(it => flattenAnswers(it))
        break
      case FieldType.CheckBox:
        data = answer.values
        break
      default:
        data = answer.value
    }

    return {
      ...allAnswers,
      [key]: data,
    }
  }, {})
