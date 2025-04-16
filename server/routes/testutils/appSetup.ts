import express, { Express, Router } from 'express'
import createError from 'http-errors'
import path from 'path'
import cookieSession from 'cookie-session'
import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import { Services } from '../../services'
import { Gender } from '../../@types/hmpo-form-wizard/enums'

export const user = {
  firstName: 'first',
  lastName: 'last',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  activeCaseLoadId: 'MDI',
  authSource: 'NOMIS',
}

export const flashProvider = jest.fn()

function appSetup(userSupplier: () => Express.User, additionalRoutes: Router[]): Express {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, path)
  app.use(cookieSession({ keys: [''] }))

  app.use((req, res, next) => {
    req.session.subjectDetails = {
      crn: 'X123456',
      pnc: '2023/0123456X',
      givenName: 'John',
      familyName: 'Doe',
      dateOfBirth: '1980-01-01',
      gender: Gender.Male,
      location: 'COMMUNITY',
    }
    next()
  })

  app.use((req, res, next) => {
    req.user = userSupplier()
    req.flash = flashProvider
    res.locals = {}
    res.locals.user = { ...req.user }
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes())
  additionalRoutes.forEach(it => app.use(it))
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler())

  return app
}

export function appWithAllRoutes({
  userSupplier = () => user,
  additionalRoutes = [],
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => Express.User
  additionalRoutes?: Router[]
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(userSupplier, additionalRoutes)
}
