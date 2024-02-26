import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { randomUUID } from 'crypto'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'

class OneTimeLinkController extends BaseController {
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
        oasysAssessmentPk: req.sessionModel.get('oastub-assessment-uuid')?.toString() || randomUUID(),
        userDisplayName: 'Probation User',
        crn: 'X123456',
      })

      res.locals.otl = link

      super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default OneTimeLinkController
