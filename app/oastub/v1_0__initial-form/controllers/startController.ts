import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'

class StartController extends BaseController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const { link } = await this.apiService.createSession({
        userSessionId: 'ABC1234567890',
        userAccess: 'READ_WRITE',
        oasysAssessmentId: '1234567890',
      })

      res.redirect(link)
    } catch (error) {
      next(error)
    }
  }
}

export default StartController
