import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from './baseController'
import {
  combineDateFields,
  compileConditionalFields,
  fieldsByCode,
  withPlaceholdersFrom,
  withValuesFrom,
} from './saveAndContinue.utils'

class SaveAndContinueController extends BaseController {
  async process(req: FormWizard.Request, res: Response, next: NextFunction) {
    req.form.values = combineDateFields(req.body, req.form.values)

    super.process(req, res, next)
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    const fields = Object.values(req.form.options.allFields)

    const fieldsWithMappedAnswers = fields.map(withValuesFrom(res.locals.values))
    const fieldsWithRenderedConditionals = compileConditionalFields(fieldsWithMappedAnswers, {
      action: res.locals.action,
      errors: res.locals.errors,
      collections: res.locals.collections,
    })
    const fieldsWithReplacements = fieldsWithRenderedConditionals.map(
      withPlaceholdersFrom(res.locals.placeholderValues || {}),
    )

    res.locals.answers = req.form.values
    res.locals.options.fields = fieldsWithReplacements
      .filter(it => res.locals.form.fields.includes(it.code))
      .reduce(fieldsByCode, {})
    res.locals.options.allFields = fieldsWithReplacements.reduce(fieldsByCode, {})

    super.locals(req, res, next)
  }
}

export default SaveAndContinueController
