import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { randomUUID } from 'crypto'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'

class CreateOneTimeLinkController extends BaseController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const oasysAssessmentPk = req.sessionModel.get('oastub-assessment-uuid')?.toString() || randomUUID()

      await this.apiService.createAssessment({ oasysAssessmentPk })

      const { link } = await this.apiService.createSession({
        oasysAssessmentPk,
        user: {
          identifier: 'ABC1234567890',
          displayName: 'Probation User',
          accessMode: 'READ_WRITE',
        },
        subjectDetails: {
          crn: 'X123456',
          pnc: '01/123456789A',
          dateOfBirth: '1970-01-01',
          givenName: 'Sam',
          familyName: 'Whitfield',
          gender: 0,
          location: 'COMMUNITY',
        },
      })

      res.locals.otl = link

      super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default CreateOneTimeLinkController
