import * as Express from 'express'
import { modesConfig } from '../modes-config'

// eslint-disable-next-line import/prefer-default-export
export const validateMode = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  const { mode } = req.params
  if (Object.keys(modesConfig).includes(mode)) {
    res.locals = { ...res.locals, ...modesConfig[mode] }
    next()
  } else {
    next(new Error('Invalid mode'))
  }
}
