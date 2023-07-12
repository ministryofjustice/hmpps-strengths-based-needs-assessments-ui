import Express from 'express'
import oastubFormRouter from './oastub/index'
import pocFormRouter from './sbna-poc/index'

export default () => {
  const router = Express.Router()

  router.use('*', (req, res, next) => {
    next()
  })

  router.use('/oastub', oastubFormRouter)
  router.use('/sbna-poc', pocFormRouter)

  return router
}
