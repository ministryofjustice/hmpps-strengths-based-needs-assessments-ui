import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import formRouter from '../../app/router'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  router.use('/form', formRouter())

  get('/', (req, res, next) => {
    res.render('pages/index')
  })

  return router
}
