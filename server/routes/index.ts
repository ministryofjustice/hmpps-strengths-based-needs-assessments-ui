import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import App from '../../app'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const app = new App()
  router.use('/form', app.formRouter)
  router.use('/config', app.formConfigRouter)

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  return router
}
