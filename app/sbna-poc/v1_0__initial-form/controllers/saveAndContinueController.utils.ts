import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { AnswerDto, Answers, UpdateAnswersDto } from '../../../../server/services/strengthsBasedNeedsService'
import { whereSelectable } from '../../../common/controllers/saveAndContinue.utils'

type SubmittedAnswers = Record<string, string | string[]>

export const buildRequestBody = (
  fieldsOnCurrentPage: FormWizard.Fields,
  allFields: FormWizard.Fields,
  submittedAnswers: SubmittedAnswers,
): UpdateAnswersDto => {
  const answersToAdd = getAnswersToAdd(fieldsOnCurrentPage, allFields, submittedAnswers)
  const answersToRemove = getAnswersToRemove(
    fieldsOnCurrentPage,
    allFields,
    submittedAnswers,
    Object.keys(answersToAdd),
  )

  return {
    answersToAdd,
    answersToRemove,
  }
}

export const mergeAnswers = (persistedAnswers: SubmittedAnswers, submittedAnswers: SubmittedAnswers) => {
  return {
    ...persistedAnswers,
    ...submittedAnswers,
  }
}

export const dependencyMet = (field: FormWizard.Field, fields: FormWizard.Fields, answers: SubmittedAnswers) => {
  const dependency = field.dependent

  if (!dependency) {
    return true
  }

  const parentField = fields[dependency.field]
  const parentFieldAnswer = answers[parentField.code]

  return Array.isArray(parentFieldAnswer)
    ? parentFieldAnswer.includes(dependency.value)
    : parentFieldAnswer === dependency.value
}

const getDependencyChain = (field: FormWizard.Field, fields: Array<FormWizard.Field>): Array<FormWizard.Field> => {
  return fields
    .filter(it => it.dependent?.field === field.code)
    .map(it => [it, ...getDependencyChain(it, fields)])
    .flat()
}

const matchingDependencyValue = (requiredValue: string, answer: string | Array<string>) =>
  Array.isArray(answer) ? answer.includes(requiredValue) : answer === requiredValue

const whereDependencyNotMet = (field: FormWizard.Field, answers: SubmittedAnswers) => (it: FormWizard.Field) => {
  return it.dependent?.field === field.code && !matchingDependencyValue(it.dependent?.value, answers[field.code])
}

const toFieldCodes = (fields: Array<FormWizard.Field>) => fields.map(it => it.code)

export const listDependenciesNotMet =
  (allFields: FormWizard.Fields, answers: SubmittedAnswers) =>
  (field: FormWizard.Field): Array<string> => {
    const fields = Object.values(allFields)

    return fields
      .filter(whereDependencyNotMet(field, answers))
      .map(it => [it, ...getDependencyChain(it, fields)])
      .flatMap(toFieldCodes)
  }

export const getAnswersToRemove = (
  fields: FormWizard.Fields,
  allFields: FormWizard.Fields,
  answers: SubmittedAnswers,
  exclusionList: string[] = [],
): string[] => {
  const toRemove = Object.values(fields)
    .map(listDependenciesNotMet(allFields, answers))
    .flat()
    .filter(it => !exclusionList.includes(it))

  return [...new Set(toRemove)]
}

export const getAnswersToAdd = (
  fields: FormWizard.Fields,
  allFields: FormWizard.Fields,
  answers: SubmittedAnswers,
): Answers => {
  return Object.values(fields)
    .filter(it => dependencyMet(it, allFields, answers))
    .reduce((answerDtos, it) => {
      const thisAnswer = answers[it.id || it.code]

      if (it) {
        switch (it.type) {
          case FieldType.CheckBox:
            return {
              ...answerDtos,
              [it.code]: {
                type: it.type,
                description: it.text,
                options: it.options.filter(whereSelectable),
                values: thisAnswer,
              },
            }
          case FieldType.Radio:
            return {
              ...answerDtos,
              [it.code]: {
                type: it.type,
                description: it.text,
                options: it.options.filter(whereSelectable),
                value: thisAnswer,
              },
            }
          default:
            return {
              ...answerDtos,
              [it.code]: {
                type: it.type,
                description: it.text,
                value: thisAnswer,
              },
            }
        }
      } else {
        return answerDtos
      }
    }, {})
}

export const flattenAnswers = (answers: Record<string, AnswerDto>) =>
  Object.entries(answers).reduce(
    (allAnswers, [key, answer]) => ({
      ...allAnswers,
      [key]: answer.type === FieldType.CheckBox ? answer.values : answer.value,
    }),
    {},
  )
