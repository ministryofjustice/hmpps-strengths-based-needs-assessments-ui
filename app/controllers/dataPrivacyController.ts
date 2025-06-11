import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from './baseController'
import { SessionData } from '../../server/services/strengthsBasedNeedsService'
import privacyScreenFields from '../form/v1_0/fields/privacy-screen'
import { withPlaceholdersFrom } from '../utils/field.utils'
import { HandoverSubject } from '../../server/services/arnsHandoverService'
import config from '../../server/config'

class DataPrivacyController extends BaseController {
  constructor(options: unknown) {
    super(options)
  }

  async configure(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionData
      const subjectDetails = req.session.subjectDetails as HandoverSubject
      const placeholderValues = { subject: subjectDetails.givenName }

      res.locals.user = {
        ...(res.locals.user || {}),
        ...(sessionData?.user || {}),
        username: sessionData?.user?.displayName || '',
      }

      res.locals.subjectDetails = subjectDetails
      res.locals.sessionData = sessionData
      res.locals.placeholderValues = placeholderValues
      res.locals.oasysUrl = config.oasysUrl
      res.locals.isPrivacyScreen = true

      const field = privacyScreenFields.privacyScreenDeclaration()
      res.locals.privacyField = withPlaceholdersFrom(placeholderValues)(field)

      return await super.configure(req, res, next)
    } catch (error) {
      return next(error)
    }
  }

  async successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionData
      const versionUrl = sessionData.formVersion.replace(/\./g, '/')
      return res.redirect(`/form/${versionUrl}/current-accommodation?action=resume`)
    } catch (error) {
      return next(error)
    }
  }
}

export default DataPrivacyController
