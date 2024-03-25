import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from './baseController'
import {
  combineDateFields,
  compileConditionalFields,
  fieldsById,
  withPlaceholdersFrom,
  withValuesFrom,
} from './saveAndContinue.utils'
import { mergeAnswers } from '../../sbna-poc/v1_0__initial-form/controllers/saveAndContinueController.utils'

class SaveAndContinueController extends BaseController {
  async configure(req: FormWizard.Request, res: Response, next: NextFunction) {
    const withFieldIds = (others: FormWizard.Fields, [key, field]: [string, FormWizard.Field]) => ({
      ...others,
      [key]: { ...field, id: key },
    })

    req.form.options.fields = Object.entries(req.form.options.fields).reduce(withFieldIds, {})
    req.form.options.allFields = Object.entries(req.form.options.allFields).reduce(withFieldIds, {})

    super.configure(req, res, next)
  }

  async process(req: FormWizard.Request, res: Response, next: NextFunction) {
    req.form.values = combineDateFields(req.body, req.form.values)
    const mergedAnswers = mergeAnswers(req.form.persistedAnswers, req.form.values)
    req.form.values = Object.entries(req.form.options.fields)
      .filter(([_, field]) => {
        const dependentValue = mergedAnswers[field.dependent?.field]
        return (
          !field.dependent ||
          (Array.isArray(dependentValue)
            ? dependentValue.includes(field.dependent.value)
            : dependentValue === field.dependent.value)
        )
      })
      .reduce((updatedAnswers, [key, field]) => {
        return field.id
          ? { ...updatedAnswers, [field.id]: req.form.values[key], [field.code]: req.form.values[key] }
          : { ...updatedAnswers, [field.code]: req.form.values[key] }
      }, {})

    return super.process(req, res, next)
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    const fieldsWithMappedAnswers = Object.values(req.form.options.allFields).map(withValuesFrom(res.locals.values))
    const fieldsWithReplacements = fieldsWithMappedAnswers.map(withPlaceholdersFrom(res.locals.placeholderValues || {}))
    const fieldsWithRenderedConditionals = compileConditionalFields(fieldsWithReplacements, {
      action: res.locals.action,
      errors: res.locals.errors,
    })

    res.locals.answers = req.form.values

    res.locals.options.fields = fieldsWithRenderedConditionals
      .filter(it => res.locals.form.fields.includes(it.code))
      .reduce(fieldsById, {})
    res.locals.options.allFields = fieldsWithRenderedConditionals.reduce(fieldsById, {})

    super.locals(req, res, next)
  }
}

export default SaveAndContinueController
