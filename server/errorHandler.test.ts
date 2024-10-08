import request from 'supertest'
import { appWithAllRoutes } from './routes/testutils/appSetup'

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  it('should render content without stack in production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Page not found')
        expect(res.text).toContain('If you typed the web address, check it is correct.')
        expect(res.text).toContain('If you pasted the web address, check you copied the entire address.')
        expect(res.text).not.toContain('NotFoundError: Not found')
      })
  })
})
