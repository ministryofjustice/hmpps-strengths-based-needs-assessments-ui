import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from './baseController'
import { compileConditionalFields, fieldsByCode, processReplacements } from './saveAndContinue.utils'

class SaveAndContinueController extends BaseController {
  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    const fields = Object.values(req.form.options.allFields)

    const fieldsWithRenderedConditionals = compileConditionalFields(fields, {})
    const fieldsWithReplacements = processReplacements(fieldsWithRenderedConditionals, { subject: 'Paul' })

    res.locals.options.fields = fieldsWithReplacements.reduce(fieldsByCode, {})

    super.locals(req, res, next)
  }
}

export default SaveAndContinueController
