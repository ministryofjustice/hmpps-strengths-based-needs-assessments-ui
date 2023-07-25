import { Response, NextFunction } from 'express'
import FormWizard, { FieldType } from 'hmpo-form-wizard'
import BaseSaveAndContinueController from '../../../common/controllers/saveAndContinue'
import StrengthsBasedNeedsAssessmentsApiService, {
  Answers,
  SessionInformation,
  SubjectResponse,
} from '../../../../server/services/strengthsBasedNeedsService'

const buildRequestBody = (req: FormWizard.Request): Answers => {
  const answers = req.form.values
  const fields = req.form.options.allFields

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

const mergeAnswers = (savedAnswers: Answers, submittedAnswers: Record<string, string | string[]>) => {
  return Object.entries(savedAnswers).reduce(
    (modifiedAnswers, [key, answer]) => ({
      ...modifiedAnswers,
      [key]: answer.type === FieldType.CheckBox ? answer.values : answer.value,
    }),
    submittedAnswers,
  )
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
      const requestBody = buildRequestBody(req)
      await this.apiService.saveAnswers(assessmentUUID, requestBody)

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default SaveAndContinueController
