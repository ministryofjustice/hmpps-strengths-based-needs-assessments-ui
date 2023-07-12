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
      const assessmentData = await this.apiService.getSession(req.query.sessionId as string)
      const subjectDetails = await this.apiService.getSubject(assessmentData.assessmentUUID)

      req.sessionModel.set('assessmentData', assessmentData)
      req.sessionModel.set('subjectDetails', subjectDetails)

      res.redirect('accommodation')
    } catch (error) {
      next(new Error('Unable to start assessment'))
    }
  }
}

export default StartController
