import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from './saveAndContinueController'
import { SessionData } from '../../server/services/strengthsBasedNeedsService'

export default class ViewVersionListController extends SaveAndContinueController {
  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionData
      res.locals.assessmentVersions = await this.apiService.fetchAssessmentVersions(sessionData.assessmentId)
      await super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
