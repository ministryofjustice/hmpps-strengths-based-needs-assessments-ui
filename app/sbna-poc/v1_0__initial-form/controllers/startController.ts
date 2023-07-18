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
      const sessionData = await this.apiService.getSession(req.query.sessionId as string)
      const subjectDetails = await this.apiService.getSubject(sessionData.assessmentUUID)

      req.session.sessionData = sessionData
      req.session.subjectDetails = subjectDetails
      req.session.save(error => {
        if (error) {
          return next(error)
        }

        return res.redirect('accommodation')
      })
    } catch (error) {
      next(new Error('Unable to start assessment'))
    }
  }
}

export default StartController
