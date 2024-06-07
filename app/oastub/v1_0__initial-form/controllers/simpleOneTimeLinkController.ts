import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { randomUUID } from 'crypto'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'
import ArnsHandoverService from '../../../../server/services/arnsHandoverService'

class SimpleOneTimeLinkController extends BaseController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  arnsHandoverService: ArnsHandoverService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
    this.arnsHandoverService = new ArnsHandoverService()
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const oasysAssessmentPk = randomUUID()

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
          returnUrl: '?returnUrlGoesHere',
        },
        subject: {
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
        assessmentContext: {
          oasysAssessmentPk,
          assessmentVersion: sanAssessmentVersion,
        },
      }

      const handoverLink = await this.arnsHandoverService.createHandoverLink(handoverContext)

      res.redirect(handoverLink)
    } catch (error) {
      next(error)
    }
  }
}

export default SimpleOneTimeLinkController
