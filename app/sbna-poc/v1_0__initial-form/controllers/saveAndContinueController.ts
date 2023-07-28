import { Response, NextFunction } from 'express'
import FormWizard, { FieldType } from 'hmpo-form-wizard'
import BaseSaveAndContinueController from '../../../common/controllers/saveAndContinue'
import StrengthsBasedNeedsAssessmentsApiService, {
  Answers,
  SessionInformation,
  SubjectResponse,
  UpdateAnswersDto,
} from '../../../../server/services/strengthsBasedNeedsService'

type SubmittedAnswers = Record<string, string | string[]>

const buildRequestBody = (
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

const mergeAnswers = (savedAnswers: Answers, submittedAnswersValues: SubmittedAnswers) => {
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

const getAnswersToRemove = (fields: FormWizard.Fields, answers: SubmittedAnswers): string[] => {
  const dependencyMet = (dependency: FormWizard.Dependent, allAnswers: SubmittedAnswers) =>
    allAnswers[dependency.field] === dependency.value

  return Object.keys(fields).reduce((fieldsToRemove, thisField) => {
    const dependency = fields[thisField].dependent

    if (dependency && !dependencyMet(dependency, answers)) {
      return [...fieldsToRemove, thisField]
    }

    return fieldsToRemove
  }, [])
}

const getAnswersToAdd = (fields: FormWizard.Fields, answers: SubmittedAnswers): Answers => {
  return Object.entries(answers).reduce((answerDtos, [key, thisAnswer]) => {
    const field = fields[key]
    if (field) {
      switch (field.type) {
        case FieldType.CheckBox:
          return {
            ...answerDtos,
            [key]: {
              type: fields[key].type,
              description: fields[key].text,
              options: field.options,
              values: thisAnswer,
            },
          }
        case FieldType.Radio:
          return {
            ...answerDtos,
            [key]: {
              type: field.type,
              description: field.text,
              options: field.options,
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

class SaveAndContinueController extends BaseSaveAndContinueController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  async configure(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionInformation
      res.locals.user = { username: sessionData.userDisplayName }
      await this.apiService.validateSession(sessionData.uuid)

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionInformation
      res.locals.sessionData = sessionData
      res.locals.subjectDetails = req.session.subjectDetails as SubjectResponse
      res.locals.placeholderValues = { subject: res.locals.subjectDetails.givenName }

      const savedAnswers = await this.apiService.fetchAnswers(sessionData.assessmentUUID)
      const submittedAnswers = res.locals.values
      res.locals.values = mergeAnswers(savedAnswers, submittedAnswers)

      super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const { assessmentUUID } = req.session.sessionData as SessionInformation

      const savedAnswers = await this.apiService.fetchAnswers(assessmentUUID)
      const submittedAnswers = req.form.values
      const allAnswers = mergeAnswers(savedAnswers, submittedAnswers)

      const { answersToAdd, answersToRemove } = buildRequestBody(
        req.form.options.allFields,
        submittedAnswers,
        allAnswers,
      )

      req.form.values = {
        ...req.form.values,
        ...answersToRemove.reduce((acc, fieldCode) => ({ ...acc, [fieldCode]: null }), {}),
      }

      await this.apiService.updateAnswers(assessmentUUID, { answersToAdd, answersToRemove })

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default SaveAndContinueController
