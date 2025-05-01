import { Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from './baseController'

describe('BaseController.configure', () => {
  it('redirects to the correct form version when session form version does not match request form version', async () => {
    const mockReq = {
      form: {
        options: { name: 'form:1.0' },
      },
      session: {
        sessionData: { formVersion: '2.0' },
      },
      originalUrl: '/form/1/0/step',
    } as FormWizard.Request

    const mockRes = {
      redirect: jest.fn(),
    } as unknown as Response

    const mockNext = jest.fn()

    const controller: BaseController = new BaseController({ route: '/' })
    await controller.configure(mockReq, mockRes, mockNext)

    expect(mockRes.redirect).toHaveBeenCalledWith('/form/2/0/step')
  })
})
