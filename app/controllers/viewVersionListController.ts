import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from './saveAndContinueController'
import { SessionData } from '../../server/services/strengthsBasedNeedsService'
import CoordinatorApiService from '../../server/services/coordinatorService'

export default class ViewVersionListController extends SaveAndContinueController {
  protected coordinatorService: CoordinatorApiService

  constructor(options: unknown) {
    super(options)

    this.coordinatorService = new CoordinatorApiService()
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionData
      res.locals.previousVersions = await this.coordinatorService.fetchAssessmentAndPlanVersions(
        sessionData.assessmentId,
      )
      await super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
