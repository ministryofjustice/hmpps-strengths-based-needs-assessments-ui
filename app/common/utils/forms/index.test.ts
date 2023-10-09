import { Router } from 'express'
import request from 'supertest'
import { bootstrapFormConfiguration } from '.'
import { appWithAllRoutes } from '../../../../server/routes/testutils/appSetup'
import { BaseFormOptions, Form } from './common'

const createTestApp = (router: Router) => {
  const app = appWithAllRoutes({ additionalRoutes: [router] })
  return app
}

describe('bootstrapFormConfiguration', () => {
  it('mounts a form when it is active', async () => {
    const options: BaseFormOptions = {
      journeyName: 'test_journey',
      journeyTitle: 'Test Journey',
    }

    const config: Form[] = [
      {
        steps: {
          '/start': {
            pageTitle: 'Test page title',
            reset: true,
            entryPoint: true,
            template: `pages/start`,
            section: 'test',
          },
        },
        fields: {},
        options: {
          tag: 'test',
          version: '1.0',
          active: true,
        },
      },
    ]

    const router = bootstrapFormConfiguration(config, options)
    const app = createTestApp(router)

    await request(app)
      .get('/start')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('<h1>Test page title</h1>')
      })

    await request(app)
      .get('/1/0/start')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('<h1>Test page title</h1>')
      })

    await request(app)
      .get('/versions')
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual({
          latest: '1.0',
          available: [{ version: '1.0', active: true, tag: 'test' }],
        })
      })
  })

  it('does not mount a form when it is inactive', async () => {
    const options: BaseFormOptions = {
      journeyName: 'test_journey',
      journeyTitle: 'Test Journey',
    }

    const config: Form[] = [
      {
        steps: {
          '/start': {
            pageTitle: 'Test page title',
            reset: true,
            entryPoint: true,
            template: `pages/start`,
            section: 'test',
          },
        },
        fields: {},
        options: {
          tag: 'test',
          version: '1.0',
          active: false,
        },
      },
    ]

    const router = bootstrapFormConfiguration(config, options)
    const app = createTestApp(router)

    await request(app).get('/start').expect(404)

    await request(app).get('/1/0/start').expect(404)

    await request(app)
      .get('/versions')
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual({
          latest: '1.0',
          available: [{ version: '1.0', active: false, tag: 'test' }],
        })
      })
  })
})
