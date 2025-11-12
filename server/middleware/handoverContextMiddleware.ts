import type { RequestHandler } from 'express'
import ArnsHandoverService from '../services/arnsHandoverService'

import asyncMiddleware from './asyncMiddleware'

const arnsHandoverService = new ArnsHandoverService()

export default function handoverContextMiddleware(): RequestHandler {
  return asyncMiddleware(async (req, res, next) => {
    if (req.path.startsWith('/config/')) {
      return next()
    }
    const accessToken = res?.locals?.user?.token

    if (accessToken) {
      req.session.handoverContext = await arnsHandoverService.getContextData(accessToken)
      return next()
    }

    return res.redirect('/sign-in')
  })
}
