import superagent from 'superagent'

const url = 'http://localhost:9191/__admin'

interface StubOptions {
  body: Record<string, string>
  urlPattern?: string
  urlPath?: string
}
interface Request {
  method: string
  urlPattern: string
  urlPath: string
}
interface Response {
  status: number
  headers: Record<string, string>
  jsonBody: Record<string, string>
}
interface Mapping {
  request: Request
  response: Response
}

const stubFor = (mapping: Mapping) => Promise.all([superagent.post(`${url}/mappings`).send(mapping)])

export const resetStubs = () =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

export const getFor = ({ body, urlPattern, urlPath }: StubOptions) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern,
      urlPath,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: body,
    },
  })

export const postFor = ({ body, urlPattern, urlPath }: StubOptions) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern,
      urlPath,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: body,
    },
  })
