import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { randomUUID } from 'crypto'
import { faker } from '@faker-js/faker'
import BaseController from '../../../common/controllers/baseController'
import StrengthsBasedNeedsAssessmentsApiService from '../../../../server/services/strengthsBasedNeedsService'

class OneTimeLinkController extends BaseController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    res.locals.assessmentUuid = randomUUID()
    res.locals.givenName = faker.person.firstName()
    res.locals.familyName = faker.person.lastName()
    res.locals.otl = req.query.otl as string

    super.locals(req, res, next)
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      req.sessionModel.set('oastub-assessment-uuid', req.form.values['oastub-assessment-uuid'])
      req.sessionModel.set('oastub-subject-gender', req.form.values['oastub-subject-gender'])
      req.sessionModel.set('oastub-subject-given-name', req.form.values['oastub-subject-given-name'])
      req.sessionModel.set('oastub-subject-family-name', req.form.values['oastub-subject-family-name'])
      req.sessionModel.set(
        'oastub-subject-sexually-motivated-offence-history',
        req.form.values['oastub-subject-sexually-motivated-offence-history'],
      )

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

export default OneTimeLinkController
