import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { randomUUID } from 'crypto'
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
        oasysAssessmentPk: randomUUID(),
        userDisplayName: 'Probation User',
        crn: 'X123456',
      })

      res.redirect(link)
    } catch (error) {
      next(error)
    }
  }
}

export default StartController
