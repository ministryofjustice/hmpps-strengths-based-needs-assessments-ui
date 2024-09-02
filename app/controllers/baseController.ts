import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import config from '../../server/config'
import { createNavigation, createSectionProgressRules } from '../utils/formRouterBuilder'

class BaseController extends FormWizard.Controller {
  async configure(req: FormWizard.Request, res: Response, next: NextFunction) {
    const { fields, section, steps } = req.form.options

    res.locals.form = {
      fields: Object.keys(fields)?.filter(fieldCode => !fields[fieldCode]?.dependent?.displayInline),
      navigation: createNavigation(req.baseUrl, steps as unknown as FormWizard.Steps, section),
      sectionProgressRules: createSectionProgressRules(steps as unknown as FormWizard.Steps),
    }

    res.locals.domain = config.domain
    return super.configure(req, res, next)
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    return super.locals(req, res, next)
  }
}

export default BaseController
