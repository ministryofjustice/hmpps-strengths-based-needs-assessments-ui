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
    res.locals.assessmentUuid = randomUUID()

    super.locals(req, res, next)
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      req.sessionModel.set('oastub-assessment-uuid', req.form.values['oastub-assessment-uuid'])

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default OneTimeLinkController
