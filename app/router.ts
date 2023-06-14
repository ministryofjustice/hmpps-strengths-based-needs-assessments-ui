import Express from 'express'
import pocFormRouter from './sbna-poc/index'

const router = Express.Router()

router.use('*', (req, res, next) => {
  next()
})
router.use('/sbna-poc', pocFormRouter)

export default router
