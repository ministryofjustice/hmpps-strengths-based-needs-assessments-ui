import * as express from 'express'
import type { Request, Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
import FormVersionResponse from './responses/formVersionResponse'
import FormFieldsResponse from './responses/formFieldsResponse'
import { Form, BaseFormOptions, FormWizardRouter, getLatestVersionFrom } from './common'
import { createSVGFromForm, createStateDiagramFromForm } from './diagrams'

const removeQueryParamsFrom = (urlWithParams: string) => {
  const [url] = urlWithParams.split('?')
  return url
}

interface NavigationItem {
  url: string
  label: string
  active: boolean
}

const createNavigation = (steps: FormWizard.Steps, baseUrl: string, currentSection: string): Array<NavigationItem> => {
  return Object.entries(steps)
    .filter(([_, stepConfig]) => stepConfig.navigationOrder)
    .sort(([_A, stepConfigA], [_B, stepConfigB]) => stepConfigA.navigationOrder - stepConfigB.navigationOrder)
    .map(([path, stepConfig]) => ({
      url: path.slice(1),
      label: stepConfig.pageTitle,
      active: stepConfig.section === currentSection,
    }))
}

const getStepFrom = (steps: FormWizard.Steps, url: string): FormWizard.Step => steps[removeQueryParamsFrom(url)]

const setupForm = (form: Form, options: BaseFormOptions): FormWizardRouter => {
  const router = express.Router()

  if (form.options.active === true) {
    router.get('/fields', (req: Request, res: Response) => res.json(FormFieldsResponse.from(form, options)))
    router.get('/diagram', (req: Request, res: Response) => {
      res.locals.diagram = createStateDiagramFromForm(form)
      return res.render('pages/diagram')
    })
    router.get('/form', (req: Request, res: Response) => res.json(form))

    router.use((req: Request, res: Response, next: NextFunction) => {
      const { fields = [], section: currentSection } = getStepFrom(form.steps, req.url)

      res.locals.form = {
        fields: fields.filter(fieldCode => !form.fields[fieldCode]?.dependent?.displayInline),
        navigation: createNavigation(form.steps, req.baseUrl, currentSection),
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

  formConfig: Form[]

  latest?: FormWizardRouter

  constructor(formConfig: Form[], routers: FormWizardRouter[], latest: FormWizardRouter) {
    this.formConfig = formConfig
    this.routers = routers
    this.latest = latest
  }

  static configure(formConfig: Form[], options: BaseFormOptions) {
    const formRouters: FormWizardRouter[] = formConfig.map(form => setupForm(form, options))

    return new FormRouterBuilder(formConfig, formRouters, getLatestVersionFrom(formRouters))
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
