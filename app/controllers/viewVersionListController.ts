import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import SaveAndContinueController from './saveAndContinueController'
import { SessionData } from '../../server/services/strengthsBasedNeedsService'

export default class ViewVersionListController extends SaveAndContinueController {
  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionData
      const versions = await this.service.getVersionsByEntityId(sessionData.assessmentId)

      // remove the latest(current) version from allVersions:
      const trimmedAllVersions = Object.fromEntries(
        Object.entries(versions.allVersions)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .slice(1),
      )

      res.locals.previousVersions = Object.values(trimmedAllVersions)

      await super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
