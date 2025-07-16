import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { DateTime } from 'luxon'
import SaveAndContinueController from './saveAndContinueController'
import { AssessmentVersionDetails, SessionData } from '../../server/services/strengthsBasedNeedsService'
import { displayDateForToday } from '../../server/utils/nunjucks.utils'

export default class ViewVersionListController extends SaveAndContinueController {
  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionData
      const versions = (await this.apiService.fetchAssessmentVersions(sessionData.assessmentId)).reverse().reduce(
        (acc, currentValue, _currentIndex, _array) => {
          return { ...acc, [displayDateForToday(DateTime.fromISO(currentValue.updatedAt))]: currentValue }
        },
        {} as Record<string, AssessmentVersionDetails>,
      )
      res.locals.previousVersions = Object.values(versions)
        .sort((a, b) => DateTime.fromISO(b.updatedAt).toMillis() - DateTime.fromISO(a.updatedAt).toMillis())
        .slice(1)
      await super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
