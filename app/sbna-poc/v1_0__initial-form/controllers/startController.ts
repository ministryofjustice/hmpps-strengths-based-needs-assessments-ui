import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'
import ArnsHandoverService from '../../../../server/services/arnsHandoverService'

class StartController extends BaseController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  arnsHandoverService: ArnsHandoverService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
    this.arnsHandoverService = new ArnsHandoverService()
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const accessToken = res.locals.user.token
      const contextData = await this.arnsHandoverService.getContextData(accessToken)
      const sessionData = {
        ...contextData.assessmentContext,
        user: contextData.principal,
      }
      const subjectDetails = contextData.subject

      req.session.sessionData = sessionData
      req.session.subjectDetails = subjectDetails
      req.session.save(error => {
        if (error) {
          return next(error)
        }

        return res.redirect('accommodation?action=resume')
      })
    } catch (error) {
      next(new Error('Unable to start assessment'))
    }
  }
}

export default StartController
