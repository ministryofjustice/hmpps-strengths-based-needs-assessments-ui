import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'

export default function createErrorHandler() {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)
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
