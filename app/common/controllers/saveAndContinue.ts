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
    const fieldsWithReplacements = fieldsWithMappedAnswers.map(withPlaceholdersFrom(res.locals.placeholderValues || {}))
    const fieldsWithRenderedConditionals = compileConditionalFields(fieldsWithReplacements, {
      action: res.locals.action,
      errors: res.locals.errors,
      collections: res.locals.collections,
    })

    res.locals.answers = req.form.values
    res.locals.options.fields = fieldsWithRenderedConditionals
      .filter(it => res.locals.form.fields.includes(it.code))
      .reduce(fieldsByCode, {})
    res.locals.options.allFields = fieldsWithRenderedConditionals.reduce(fieldsByCode, {})

    super.locals(req, res, next)
  }
}

export default SaveAndContinueController
