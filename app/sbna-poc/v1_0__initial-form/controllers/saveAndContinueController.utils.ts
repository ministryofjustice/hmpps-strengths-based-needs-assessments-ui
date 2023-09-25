import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { Answers, UpdateAnswersDto } from '../../../../server/services/strengthsBasedNeedsService'
import { whereSelectable } from '../../../common/controllers/saveAndContinue.utils'

type SubmittedAnswers = Record<string, string | string[]>

export const buildRequestBody = (
  fields: FormWizard.Fields,
  submittedAnswers: SubmittedAnswers,
  allAnswers: SubmittedAnswers,
): UpdateAnswersDto => {
  const answersToAdd = getAnswersToAdd(fields, submittedAnswers)
  const answersToRemove = getAnswersToRemove(fields, allAnswers)

  return {
    answersToAdd,
    answersToRemove,
  }
}

export const mergeAnswers = (savedAnswers: Answers, submittedAnswersValues: SubmittedAnswers) => {
  const savedAnswerValues = Object.entries(savedAnswers).reduce(
    (modifiedAnswers, [key, answer]) => ({
      ...modifiedAnswers,
      [key]: answer.type === FieldType.CheckBox ? answer.values : answer.value,
    }),
    {},
  )
  return {
    ...savedAnswerValues,
    ...submittedAnswersValues,
  }
}

export const getAnswersToRemove = (fields: FormWizard.Fields, answers: SubmittedAnswers): string[] => {
  const dependencyMet = (dependency: FormWizard.Dependent, allAnswers: SubmittedAnswers) => {
    const answer = allAnswers[dependency.field]

    return Array.isArray(answer) ? answer.includes(dependency.value) : answer === dependency.value
  }

  return Object.keys(fields).reduce((fieldsToRemove, thisField) => {
    const dependency = fields[thisField].dependent

    if (dependency && !dependencyMet(dependency, answers)) {
      return [...fieldsToRemove, thisField]
    }

    return fieldsToRemove
  }, [])
}

export const getAnswersToAdd = (fields: FormWizard.Fields, answers: SubmittedAnswers): Answers => {
  return Object.entries(answers)
    .filter(([key]) => fields[key]?.type !== FieldType.Collection)
    .reduce((answerDtos, [key, thisAnswer]) => {
      const field = fields[key]
      if (field) {
        switch (field.type) {
          case FieldType.CheckBox:
            return {
              ...answerDtos,
              [key]: {
                type: fields[key].type,
                description: fields[key].text,
                options: field.options.filter(whereSelectable),
                values: thisAnswer,
              },
            }
          case FieldType.Radio:
            return {
              ...answerDtos,
              [key]: {
                type: field.type,
                description: field.text,
                options: field.options.filter(whereSelectable),
                value: thisAnswer,
              },
            }
          default:
            return {
              ...answerDtos,
              [key]: {
                type: field.type,
                description: field.text,
                value: thisAnswer,
              },
            }
        }
      } else {
        return answerDtos
      }
    }, {})
}
