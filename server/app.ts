import express from 'express'

import path from 'path'
import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import { metricsMiddleware } from './monitoring/metricsApp'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import routes from './routes'
import authorisationMiddleware from './middleware/authorisationMiddleware'

export default function createApp(): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(metricsMiddleware)
  app.use(setUpHealthChecks())
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app, path)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())
  // disabled CSRF handled by hmpo-form-wizard
  // app.use(setUpCsrf())
  // app.use(setUpCurrentUser())

  app.use(routes())

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler())

  return app
}
