import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { randomUUID } from 'crypto'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'

class CreateOneTimeLinkController extends BaseController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  parseGender(value: string): number {
    const parsedGender = Number.parseInt(value, 10)

    return Number.isInteger(parsedGender) && [0, 1, 2, 9].includes(parsedGender) ? parsedGender : 0
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const oasysAssessmentPk = req.sessionModel.get('oastub-assessment-uuid')?.toString() || randomUUID()
      const gender = this.parseGender(req.sessionModel.get('oastub-subject-gender') as string) || 0
      const givenName = (req.sessionModel.get('oastub-subject-given-name') as string) || 'Sam'
      const familyName = (req.sessionModel.get('oastub-subject-family-name') as string) || 'Whitfield'
      const sexuallyMotivatedOffenceHistory =
        (req.sessionModel.get('oastub-subject-sexually-motivated-offence-history') as string) || 'NO'

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
          givenName,
          familyName,
          gender,
          location: 'COMMUNITY',
          sexuallyMotivatedOffenceHistory,
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
