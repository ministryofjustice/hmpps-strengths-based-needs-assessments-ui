import { Request } from 'express'
import HttpError from './httpError'

export default class ForbiddenError extends HttpError {
  constructor(req: Request) {
    super(req, 403)
  }
}
