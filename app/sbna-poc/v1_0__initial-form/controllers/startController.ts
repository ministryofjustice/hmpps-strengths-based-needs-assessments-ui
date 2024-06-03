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

      const assessment = await this.apiService.fetchOasysAssessment(contextData.assessmentContext.oasysAssessmentPk)
      const version = assessment.sanAssessmentData.metaData.formVersion?.replace('.', '/').concat('/') || ''

      req.session.sessionData = {
        ...contextData.assessmentContext,
        assessmentId: assessment.sanAssessmentId,
        user: contextData.principal,
      }
      req.session.subjectDetails = contextData.subject
      req.session.save(error => {
        if (error) {
          return next(error)
        }

        return res.redirect(`${version}accommodation?action=resume`)
      })
    } catch (error) {
      next(new Error('Unable to start assessment'))
    }
  }
}

export default StartController
