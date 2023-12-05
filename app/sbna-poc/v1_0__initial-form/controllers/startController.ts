import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'

const getFormVersionInformationFrom = (req: FormWizard.Request) => req.form.options.journeyName.split(':')

class StartController extends BaseController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const [form, version] = getFormVersionInformationFrom(req)
      const sessionData = await this.apiService.useOneTimeLink(req.query.sessionId as string, { form, version })
      const subjectDetails = await this.apiService.getSubject(sessionData.assessmentUUID)

      req.session.sessionData = sessionData
      req.session.subjectDetails = subjectDetails
      req.session.save(error => {
        if (error) {
          return next(error)
        }

        return res.redirect('landing-page')
      })
    } catch (error) {
      next(new Error('Unable to start assessment'))
    }
  }
}

export default StartController
