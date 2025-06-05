import { type Response, NextFunction, Router } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { HTTPError } from 'superagent'
import FormRouterBuilder from './utils/formRouterBuilder'
import { formVersions } from './form'

interface FormWizardError extends HTTPError {
  redirect?: string
}

export default class App {
  formRouter: Router

  formConfigRouter: Router

  static errorHandler(error: FormWizardError, req: FormWizard.Request, res: Response, next: NextFunction) {
    if (error.redirect) return res.redirect(error.redirect)
    return next(error)
  }

  constructor() {
    const formRouterBuilder = FormRouterBuilder.configure(...Object.values(formVersions))

    this.formRouter = formRouterBuilder.formRouter.use(App.errorHandler)
    this.formConfigRouter = formRouterBuilder.formConfigRouter
  }
}
