import { HTTPError } from 'superagent'
import { Request } from 'express'

export default class HttpError implements HTTPError {
  message: string

  method: string

  name: string

  path: string

  status: number

  text: string

  constructor(req: Request, status: number) {
    this.message = `${status} error`
    this.name = `${status} error`
    this.status = status
    this.text = `${status} error`
    this.method = req.method
    this.path = req.path
  }
}
