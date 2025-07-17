import { Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from './baseController'
import { defaultName } from '../../server/utils/azureAppInsights'
import {
  createNavigation,
  createSectionProgressRules,
  NavigationItem,
  SectionCompleteRule,
} from '../utils/formRouterBuilder'

jest.mock('../../server/config', () => {
  const actual = jest.requireActual('../../server/config')

  return {
    ...actual.default,
    domain: 'http://foo.bar',
    oasysUrl: 'http://bar.baz',
    feedbackUrl: 'http://foo.baz',
    apis: { ...actual.default.apis, appInsights: { connectionString: 'http://connect.to.appinsights.foo' } },
  }
})

jest.mock('../../server/utils/azureAppInsights', () => ({
  defaultName: jest.fn(() => 'default_name'),
}))

jest.mock('../utils/formRouterBuilder', () => {
  const actual = jest.requireActual('../utils/formRouterBuilder')

  return {
    ...(jest.createMockFromModule('../utils/formRouterBuilder') as Record<string, unknown>),
    isInEditMode: actual.isInEditMode,
  }
})

describe('BaseController.configure', () => {
  const mockedNavigation: NavigationItem[] = [
    {
      url: '/foo',
      section: 'foo_section',
      label: 'Foo',
      active: true,
    },
  ]

  const mockSectionProgressRules: SectionCompleteRule[] = [
    {
      sectionName: 'foo_section',
      fieldCodes: ['foo_field'],
    },
  ]

  beforeEach(() => {
    ;(createNavigation as jest.Mock).mockReturnValue(mockedNavigation)
    ;(createSectionProgressRules as jest.Mock).mockReturnValue(mockSectionProgressRules)
  })

  afterEach(() => {
    ;(createNavigation as jest.Mock).mockReset()
    ;(createSectionProgressRules as jest.Mock).mockReset()
  })

  it('updates locals', async () => {
    const req = {
      form: {
        options: {
          name: 'Assessment:1.0',
          fields: {
            foo_field: { dependent: { displayInline: false } } as unknown as FormWizard.Field,
            bar_field: { dependent: { displayInline: true } } as unknown as FormWizard.Field,
          } as FormWizard.Fields,
          steps: {},
          section: 'foo_section',
        },
      },
      session: {
        sessionData: { user: { accessMode: 'READ_WRITE' } },
      },
      params: { mode: 'edit' },
      originalUrl: `/form/edit/${crypto.randomUUID()}/step`,
    } as unknown as FormWizard.Request

    const res = {
      redirect: jest.fn(),
      locals: {},
    } as unknown as Response

    const next = jest.fn()

    const controller: BaseController = new BaseController({ route: '/' })
    await controller.configure(req, res, next)

    expect(res.locals.form).toEqual({
      fields: ['foo_field'],
      navigation: mockedNavigation,
      sectionProgressRules: mockSectionProgressRules,
    })

    expect(createNavigation as jest.Mock).toHaveBeenCalledWith(
      req.baseUrl,
      req.form.options.steps,
      req.form.options.section,
      true,
    )
    expect(createSectionProgressRules as jest.Mock).toHaveBeenCalledWith(req.form.options.steps)

    expect(res.locals.domain).toEqual('http://foo.bar')
    expect(res.locals.oasysUrl).toEqual('http://bar.baz')
    expect(res.locals.feedbackUrl).toEqual('http://foo.baz')
    expect(res.locals.applicationInsightsConnectionString).toEqual('http://connect.to.appinsights.foo')

    expect(defaultName).toHaveBeenCalled()
    expect(res.locals.applicationInsightsRoleName).toEqual('default_name')
  })
})
