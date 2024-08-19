import { type Response, NextFunction, Router } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { HTTPError } from 'superagent'
import FormRouterBuilder from './utils/formRouterBuilder'
import V1_0 from './form/v1_0'

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
    const formRouterBuilder = FormRouterBuilder.configure(V1_0)

    this.formRouter = formRouterBuilder.formRouter.use(App.errorHandler)
    this.formConfigRouter = formRouterBuilder.formConfigRouter
  }
}
