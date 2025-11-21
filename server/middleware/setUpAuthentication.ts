import type { Router } from 'express'
import express from 'express'
import passport from 'passport'
import flash from 'connect-flash'
import config from '../config'
import auth from '../authentication/auth'

const router = express.Router()

export default function setUpAuth(): Router {
  auth.init()

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('autherror')
  })

  router.get('/sign-in', passport.authenticate('oauth2'))

  router.get('/sign-in/callback', (req, res, next) =>
    passport.authenticate('oauth2', {
      successReturnToOrRedirect: req.session.previousVersionsRedirect || '/start',
      failureRedirect: '/autherror',
    })(req, res, next),
  )

  // Added to support the use case of when the sessionData.assessmentId is different to the requested assessment.metaData.uuid
  // This happens when a user has viewed an assessment and then tries to view a previous version of a different assessment.
  router.get(
    '/form/view-historic/:assessmentVersion/accommodation-tasks',
    passport.authenticate('oauth2', {
      successReturnToOrRedirect: '/start',
      failureRedirect: '/autherror',
    }),
  )

  const authUrl = config.apis.arnsHandover.url
  const authParameters = `client_id=${config.apis.arnsHandover.clientId}&redirect_uri=${config.domain}`

  router.use('/sign-out', (req, res, next) => {
    const authSignOutUrl = `${authUrl}/sign-out?${authParameters}`
    if (req.user) {
      req.logout(err => {
        if (err) return next(err)
        return req.session.destroy(() => res.redirect(authSignOutUrl))
      })
    } else res.redirect(authSignOutUrl)
  })

  router.use((req, res, next) => {
    res.locals.user = req.user
    next()
  })

  return router
}
