import type { Request, Response } from 'express'
import ArnsHandoverService from '../services/arnsHandoverService'
import handoverContextMiddleware from './handoverContextMiddleware'

jest.mock('../../server/services/arnsHandoverService')

describe('handoverContextMiddleware', () => {
  const next = jest.fn()
  const mockGetContextData = ArnsHandoverService.prototype.getContextData as jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    mockGetContextData.mockReset()
  })

  it('should get handover context and call next when accessToken exists', async () => {
    const assessmentUuid = crypto.randomUUID()
    const req: Request = {
      path: '/some/path',
      session: {
        sessionData: { assessmentId: assessmentUuid },
      },
    } as Request

    const res = {
      locals: { user: { token: 'mockToken' } },
      redirect: jest.fn(),
    } as unknown as Response

    mockGetContextData.mockResolvedValue({ assessmentContext: { assessmentId: assessmentUuid } })

    await handoverContextMiddleware()(req, res, next)

    expect(req.session.handoverContext).toEqual({ assessmentContext: { assessmentId: assessmentUuid } })
    expect(next).toHaveBeenCalledWith()
  })

  it('should redirect to /sign-in when accessToken does not exist', async () => {
    const req: Request = {
      path: '/some/path',
      session: {},
    } as Request

    const res = {
      locals: { user: { token: undefined } },
      redirect: jest.fn(),
    } as unknown as Response

    await handoverContextMiddleware()(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/sign-in')
  })

  it('should call next when path begins with /config/', async () => {
    const req: Request = {
      path: '/config/',
      session: {},
    } as Request

    const res = {
      locals: { user: { token: 'mockToken' } },
      redirect: jest.fn(),
    } as unknown as Response

    await handoverContextMiddleware()(req, res, next)

    expect(mockGetContextData).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
