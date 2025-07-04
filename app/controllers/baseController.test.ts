import { Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from './baseController'

describe('BaseController.configure', () => {
  it('redirects to the correct form version when session form version does not match request form version', async () => {
    const req = {
      form: {
        options: { name: 'form:1.0', fields: {}, steps: {} },
      },
      session: {
        sessionData: { formVersion: '2.0', user: { accessMode: 'READ_WRITE' } },
      },
      params: { mode: 'edit' },
      originalUrl: '/form/1/0/step',
    } as unknown as FormWizard.Request

    const res = {
      redirect: jest.fn(),
      locals: {},
    } as unknown as Response

    const next = jest.fn()

    const controller: BaseController = new BaseController({ route: '/' })
    await controller.configure(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith('/form/2/0/step')
  })
})
