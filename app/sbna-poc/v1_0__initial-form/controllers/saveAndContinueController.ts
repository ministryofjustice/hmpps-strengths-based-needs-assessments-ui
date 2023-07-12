import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseSaveAndContinueController from '../../../common/controllers/saveAndContinue'
import { SessionResponse, SubjectResponse } from '../../../../server/services/strengthsBasedNeedsService'

class SaveAndContinueController extends BaseSaveAndContinueController {
  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    res.locals.assessmentData = req.sessionModel.get('assessmentData') as SessionResponse
    res.locals.subjectDetails = req.sessionModel.get('subjectDetails') as SubjectResponse
    res.locals.placeholderValues = { subject: res.locals.subjectDetails.givenName }

    super.locals(req, res, next)
  }
}

export default SaveAndContinueController
