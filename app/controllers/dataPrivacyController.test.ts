import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import DataPrivacyController from './dataPrivacyController'

describe('dataPrivacyController', () => {
  describe('configure', () => {
    it('correctly sets up res.locals so page can be rendered', async () => {
      const mockReq = {
        session: {
          sessionData: {
            user: {
              displayName: 'Tester',
            },
          },
          subjectDetails: {
            givenName: 'Sam',
          },
        },
      } as FormWizard.Request

      const mockRes = {
        locals: { user: { token: 'mockToken' } },
        redirect: jest.fn(),
      } as unknown as Response

      const mockNext = jest.fn()

      const controller = new DataPrivacyController({
        route: '/form/1/0/close-anything-not-needed-before-appointment',
        name: 'close-anything-not-needed-before-appointment',
        template: 'form/pages/data-privacy',
      })

      await controller.configure(mockReq, mockRes, mockNext)

      expect(mockRes.locals.isPrivacyScreen).toBe(true)
      expect(mockRes.locals.placeholderValues).toEqual({ subject: 'Sam' })
      expect(mockRes.locals.privacyField).toBeDefined()
      expect(mockNext).toHaveBeenCalledTimes(1)
    })
  })

  describe('successHandler', () => {
    it('redirects to the correct URL using formVersion', async () => {
      const mockReq = {
        session: {
          sessionData: {
            formVersion: '1.0',
          },
        },
      } as FormWizard.Request

      const mockRes = {
        redirect: jest.fn(),
      } as unknown as Response

      const mockNext = jest.fn() as NextFunction

      const controller = new DataPrivacyController({
        route: '/form/1/0/close-anything-not-needed-before-appointment',
        name: 'close-anything-not-needed-before-appointment',
        template: 'form/pages/data-privacy',
      })

      await controller.successHandler(mockReq, mockRes, mockNext)

      expect(mockRes.redirect).toHaveBeenCalledWith('/form/1/0/current-accommodation?action=resume')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next with an error if sessionData is missing', async () => {
      const mockReq = {
        session: {},
      } as unknown as FormWizard.Request

      const mockRes = {
        redirect: jest.fn(),
      } as unknown as Response

      const mockNext = jest.fn() as unknown as NextFunction

      const controller = new DataPrivacyController({
        route: '/form/1/0/close-anything-not-needed-before-appointment',
        name: 'close-anything-not-needed-before-appointment',
        template: 'form/pages/data-privacy',
      })

      await controller.successHandler(mockReq, mockRes, mockNext)

      expect(mockRes.redirect).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error))
    })
  })
})
