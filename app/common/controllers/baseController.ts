import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'

class BaseController extends FormWizard.Controller {
  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    super.locals(req, res, next)
  }
}

export default BaseController
