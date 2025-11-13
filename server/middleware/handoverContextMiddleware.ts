import type { RequestHandler } from 'express'
import { SessionData } from 'express-session'
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
      try {
        const handoverContext = await arnsHandoverService.getContextData(accessToken)
        req.session.handoverContext = handoverContext
        const sessionData = req.session.sessionData as SessionData
        req.session.sessionData = {
          ...sessionData,
          assessmentId: handoverContext.assessmentContext.assessmentId,
        } as SessionData
        return next()
      } catch (e) {
        return next(e)
      }
    }

    return res.redirect('/sign-in')
  })
}
