import Express, { type Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { HTTPError } from 'superagent'
import FormRouterBuilder from './common/utils/formRouterBuilder'
import V1_0 from './form/v1_0'

interface FormWizardError extends HTTPError {
  redirect?: string
}

export default () => {
  const router = Express.Router()
  const formRouter = FormRouterBuilder.configure(V1_0).mountActive().build()

  router.use('*', (req, res, next) => {
    next()
  })

  // TODO: Clean-up - remove
  router.use('/sbna-poc', formRouter)
  router.use('/', formRouter)

  router.use((error: FormWizardError, req: FormWizard.Request, res: Response, next: NextFunction) => {
    if (error.redirect) return res.redirect(error.redirect)
    return next(error)
  })

  return router
}
