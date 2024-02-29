import Express, { type Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { HTTPError } from 'superagent'
import oastubFormRouter from './oastub/index'
import pocFormRouter from './sbna-poc/index'

interface FormWizardError extends HTTPError {
  redirect?: string
}

export default () => {
  const router = Express.Router()

  router.use('*', (req, res, next) => {
    next()
  })

  router.use('/oastub', oastubFormRouter)
  router.use('/sbna-poc', pocFormRouter)

  router.use((error: FormWizardError, req: FormWizard.Request, res: Response, next: NextFunction) => {
    if (error.redirect) return res.redirect(error.redirect)
    return next(error)
  })

  return router
}
