import * as express from 'express'
import type { Request, Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import FormVersionResponse from './responses/formVersionResponse'
import FormFieldsResponse from './responses/formFieldsResponse'
import { Form, BaseFormOptions, FormWizardRouter, getLatestVersionFrom } from './common'

const removeQueryParamsFrom = (urlWithParams: string) => {
  const [url] = urlWithParams.split('?')
  return url
}

const setupForm = (form: Form, options: BaseFormOptions): FormWizardRouter => {
  const router = express.Router()

  if (form.options.active === true) {
    router.get('/fields', (req: Request, res: Response) => res.json(FormFieldsResponse.from(form, options)))

    router.use((req: Request, res: Response, next: NextFunction) => {
      const { fields = [] } = form.steps[removeQueryParamsFrom(req.url)]
      const steps = Object.entries(form.steps)
        .filter(([_, stepConfig]) => stepConfig.navigationOrder)
        .sort(([_A, stepConfigA], [_B, stepConfigB]) => stepConfigA.navigationOrder - stepConfigB.navigationOrder)
        .map(([path, stepConfig]) => ({ url: `${req.baseUrl}${path}`, label: stepConfig.pageTitle }))

      res.locals.form = {
        fields: fields.filter(fieldCode => !form.fields[fieldCode].dependent),
        navigation: steps,
      }

      next()
    })

    router.use(
      FormWizard(form.steps, form.fields, {
        journeyName: `${options.journeyName}:${form.options.version}`,
        journeyPageTitle: options.journeyTitle,
        name: `${options.journeyName}:${form.options.version}`,
        entryPoint: options.entryPoint || false,
      }),
    )
  }

  return { metaData: form.options, router }
}

const mountRouter = (router: express.Router) => (form: FormWizardRouter) => {
  const [majorVersion, minorVersion] = form.metaData.version.split('.')
  router.use(`/${majorVersion}/${minorVersion}`, form.router)
}

export default class FormRouterBuilder {
  baseRouter?: express.Router = express.Router()

  routers: FormWizardRouter[]

  latest?: FormWizardRouter

  constructor(routers: FormWizardRouter[], latest: FormWizardRouter) {
    this.routers = routers
    this.latest = latest
  }

  static configure(formConfig: Form[], options: BaseFormOptions) {
    const formRouters: FormWizardRouter[] = formConfig.map(form => setupForm(form, options))

    return new FormRouterBuilder(formRouters, getLatestVersionFrom(formRouters))
  }

  mountActive(): FormRouterBuilder {
    this.routers.filter((form: FormWizardRouter) => form.metaData.active).forEach(mountRouter(this.baseRouter))

    this.baseRouter.use('/versions', (req: Request, res: Response) => res.json(this.intoResponse()))

    if (this.latest) {
      this.baseRouter.use('/', this.latest.router)
    }

    return this
  }

  intoResponse(): FormVersionResponse {
    return {
      latest: this.latest?.metaData.version || null,
      available: this.routers.map(it => ({
        version: it.metaData.version,
        active: it.metaData.active,
        tag: it.metaData.tag,
      })),
    }
  }

  build(): express.Router {
    return this.baseRouter
  }
}
