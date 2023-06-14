import { NextFunction, Request, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'

const { Controller } = FormWizard

class BaseController extends Controller {
  async locals(req: Request, res: Response, next: NextFunction) {
    super.locals(req, res, next)
  }
}

export default BaseController
