import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from '../../../common/controllers/baseController'

class LandingPageController extends BaseController {
  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    res.locals.showComplete = req.query.status === 'complete'

    super.locals(req, res, next)
  }
}

export default LandingPageController
