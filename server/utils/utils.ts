import { Request } from 'express'
import { HandoverPrincipal } from '../services/arnsHandoverService'

export const isInEditMode = (user: HandoverPrincipal, req: Request) =>
  user.accessMode === 'READ_WRITE' && req.params.mode === 'edit'
