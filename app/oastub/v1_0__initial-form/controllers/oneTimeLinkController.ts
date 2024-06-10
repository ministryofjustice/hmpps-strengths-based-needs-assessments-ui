import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { randomUUID } from 'crypto'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'
import ArnsHandoverService from '../../../../server/services/arnsHandoverService'

class OneTimeLinkController extends BaseController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  arnsHandoverService: ArnsHandoverService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
    this.arnsHandoverService = new ArnsHandoverService()
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    res.locals.assessmentUuid = randomUUID()
    res.locals.givenName = faker.person.firstName()
    res.locals.familyName = faker.person.lastName()
    res.locals.otl = req.query.otl || req.sessionModel.get('one-time-link')

    super.locals(req, res, next)
  }

  parseGender(value: string): number {
    const parsedGender = Number.parseInt(value, 10)

    return Number.isInteger(parsedGender) && [0, 1, 2, 9].includes(parsedGender) ? parsedGender : 0
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const oasysAssessmentPk = req.form.values['oastub-assessment-uuid']?.toString() || randomUUID()
      const gender = this.parseGender(req.form.values['oastub-subject-gender'] as string) || 0
      const givenName = (req.form.values['oastub-subject-given-name'] as string) || 'Bruce'
      const familyName = (req.form.values['oastub-subject-family-name'] as string) || req.url
      const sexuallyMotivatedOffenceHistory =
        (req.form.values['oastub-subject-sexually-motivated-offence-history'] as string) || 'NO'
      const oasysUser = { id: 'ABC1234567890', name: 'Probation User' }

      const { sanAssessmentVersion } = await this.apiService.createAssessment({
        oasysAssessmentPk,
        userDetails: oasysUser,
      })

      const handoverContext = {
        principal: {
          identifier: oasysUser.id,
          displayName: oasysUser.name,
          accessMode: 'READ_WRITE',
        },
        subject: {
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
        assessmentContext: {
          oasysAssessmentPk,
          assessmentVersion: sanAssessmentVersion,
        },
      }

      const handoverLink = await this.arnsHandoverService.createHandoverLink(handoverContext)

      req.sessionModel.set('one-time-link', handoverLink)

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default OneTimeLinkController
