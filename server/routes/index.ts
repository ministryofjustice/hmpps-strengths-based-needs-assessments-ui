import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import App from '../../app'
import startController from '../../app/controllers/startController'
import config from '../config'
import { validateMode } from '../middleware/validateMode'
import viewHistoricalVersions from '../../app/controllers/viewHistoricalVersions'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const app = new App()
  router.use('/form/:mode/:uuid', validateMode, app.getFormWizardRouter())
  router.use(App.errorHandler)
  router.use('/config', app.formConfigRouter)
  router.use('/start', startController) // viewing or editing the latest version
  router.use('/view-historical-versions', viewHistoricalVersions) // for viewing previous versions

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  get('/accessibility-statement', (req, res, next) => {
    res.locals.feedbackUrl = config.feedbackUrl
    res.render('pages/accessibility-statement')
  })

  return router
}
