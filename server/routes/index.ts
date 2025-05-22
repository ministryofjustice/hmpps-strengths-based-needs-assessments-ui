import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import App from '../../app'
import startController from '../../app/controllers/startController'
import config from '../config'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const app = new App()
  router.use('/form', app.formRouter)
  router.use('/config', app.formConfigRouter)
  router.use('/start', startController)

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  get('/accessibility-statement', (req, res, next) => {
    res.locals.feedbackUrl = config.feedbackUrl
    res.render('pages/accessibility-statement')
  })

  return router
}
