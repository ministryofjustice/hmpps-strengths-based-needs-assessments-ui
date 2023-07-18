import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseSaveAndContinueController from '../../../common/controllers/saveAndContinue'
import StrengthsBasedNeedsAssessmentsApiService, {
  SessionResponse,
  SubjectResponse,
} from '../../../../server/services/strengthsBasedNeedsService'

class SaveAndContinueController extends BaseSaveAndContinueController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  async configure(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionResponse
      res.locals.user = { username: sessionData.userDisplayName }
      await this.apiService.validateSession(sessionData.uuid)

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    res.locals.sessionData = req.session.sessionData as SessionResponse
    res.locals.subjectDetails = req.session.subjectDetails as SubjectResponse
    res.locals.placeholderValues = { subject: res.locals.subjectDetails.givenName }

    super.locals(req, res, next)
  }
}

export default SaveAndContinueController
