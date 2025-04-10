import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'
import { HandoverSubject } from './services/arnsHandoverService'

export default function createErrorHandler() {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction) => {
    const subjectDetails = req.session.subjectDetails as HandoverSubject
    logger.error(
      {
        err: error,
        url: req.originalUrl,
        user: res.locals.user?.username,
        crn: subjectDetails.crn,
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
