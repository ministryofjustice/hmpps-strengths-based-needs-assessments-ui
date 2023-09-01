import { Response, NextFunction } from 'express'
import FormWizard, { FieldType } from 'hmpo-form-wizard'
import BaseSaveAndContinueController from '../../../common/controllers/saveAndContinue'
import StrengthsBasedNeedsAssessmentsApiService, {
  SessionInformation,
  SubjectResponse,
} from '../../../../server/services/strengthsBasedNeedsService'
import { buildRequestBody, mergeAnswers } from './saveAndContinueController.utils'

class AddPartnerController extends BaseSaveAndContinueController {
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

      res.locals.collections = Object.entries(savedAnswers)
        .filter(([_, answer]) => answer.type === FieldType.Collection)
        .reduce((rest, [field, answer]) => ({ ...rest, [field]: answer.collection }), {})

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

      await this.apiService.addToCollection(assessmentUUID, 'living_with_partner', { answersToAdd, answersToRemove })

      req.form.values = {}

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default AddPartnerController
