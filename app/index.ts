import Express, { type Response, NextFunction, Router } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { HTTPError } from 'superagent'
import FormRouterBuilder from './common/utils/formRouterBuilder'
import V1_0 from './form/v1_0'

interface FormWizardError extends HTTPError {
  redirect?: string
}

export default class App {
  formRouter: Router

  formConfigRouter: Router

  constructor() {
    const formRouterBuilder = FormRouterBuilder.configure(V1_0)

    this.formRouter = Express.Router()
      .use('/sbna-poc', formRouterBuilder.formRouter) // TODO: remove
      .use('/', formRouterBuilder.formRouter)
      .use('*', (_req, _res, next) => {
        next()
      })
      .use((error: FormWizardError, req: FormWizard.Request, res: Response, next: NextFunction) => {
        if (error.redirect) return res.redirect(error.redirect)
        return next(error)
      })

    this.formConfigRouter = formRouterBuilder.formConfigRouter
  }
}
