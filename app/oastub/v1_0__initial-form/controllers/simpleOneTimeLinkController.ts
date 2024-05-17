import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { randomUUID } from 'crypto'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'

class SimpleOneTimeLinkController extends BaseController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const oasysAssessmentPk = randomUUID()

      await this.apiService.createAssessment({ oasysAssessmentPk })

      const { link } = await this.apiService.createSession({
        oasysAssessmentPk,
        user: {
          identifier: 'ABC1234567890',
          displayName: 'Probation User',
          accessMode: 'READ_WRITE',
        },
        subjectDetails: {
          crn: `X${Math.floor(100_000 + Math.random() * 900_000)}`,
          pnc: `01/${Math.floor(10_000_000 + Math.random() * 90_000_000)}A`,
          dateOfBirth: faker.date
            .past({ years: 70, refDate: DateTime.now().minus({ years: 18 }).toISODate() })
            .toISOString(),
          givenName: 'Sam',
          familyName: 'Whitfield',
          gender: 0,
          location: 'COMMUNITY',
          sexuallyMotivatedOffenceHistory: 'Yes',
        },
      })

      res.redirect(link)
    } catch (error) {
      next(error)
    }
  }
}

export default SimpleOneTimeLinkController
