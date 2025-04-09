import type { NextFunction, Request, Response } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'
import { SessionData } from './services/strengthsBasedNeedsService'

export default function createErrorHandler() {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction) => {
    const sessionData: SessionData = req.session.sessionData as SessionData
    logger.error(
      {
        err: error,
        url: req.originalUrl,
        user: res.locals.user?.username,
        assessmentId: sessionData.assessmentId,
      },
      'Error handling request',
    )
    res.status(error.status || 500)
    switch (error.status) {
      case 401:
      case 403:
      case 404:
      case 503:
        return res.render(`error/${error.status}`)
      default:
        return res.render('error/500')
    }
  }
}
