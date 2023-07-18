import type { Router } from 'express'
import express from 'express'
import flash from 'connect-flash'

const router = express.Router()

export default function setUpAuth(): Router {
  router.use(flash())

  router.use((req, res, next) => {
    res.locals.user = req.user
    next()
  })

  return router
}
