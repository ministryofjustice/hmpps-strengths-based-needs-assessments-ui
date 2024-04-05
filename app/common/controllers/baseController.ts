import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import config from '../../../server/config';

class BaseController extends FormWizard.Controller {
  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    res.locals.domain = config.domain
    super.locals(req, res, next)
  }
}

export default BaseController
