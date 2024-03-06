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

interface NavigationItem {
  url: string
  label: string
  active: boolean
}

export const createNavigation = (steps: FormWizard.Steps, currentSection: string): Array<NavigationItem> => {
  return Object.entries(steps)
    .filter(([_, stepConfig]) => stepConfig.navigationOrder)
    .sort(([_A, stepConfigA], [_B, stepConfigB]) => stepConfigA.navigationOrder - stepConfigB.navigationOrder)
    .map(([path, stepConfig]) => ({
      url: path.slice(1),
      section: stepConfig.section,
      label: stepConfig.pageTitle,
      active: stepConfig.section === currentSection,
    }))
}

type SectionCompleteRule = { sectionName: string; fieldCodes: Array<string> }

export const createSectionProgressRules = (steps: FormWizard.Steps): Array<SectionCompleteRule> => {
  const sectionRules: Record<string, Set<string>> = Object.values(steps)
    .map((step): [string, Array<string>] => [step.section, (step.sectionProgressRules || []).map(it => it.fieldCode)])
    .filter(([sectionName]) => sectionName !== 'none')
    .reduce(
      (sections, [sectionName, rules]) => ({
        ...sections,
        [sectionName]: [...(sections[sectionName] || []), ...rules],
      }),
      {},
    )

  return Object.entries(sectionRules).map(([sectionName, fieldCodes]) => ({
    sectionName,
    fieldCodes: [...new Set(fieldCodes)],
  }))
}

export const getStepFrom = (steps: FormWizard.Steps, url: string): FormWizard.Step => steps[removeQueryParamsFrom(url)]

function checkFormIntegrity(form: Form) {
  const fieldsIncludedInSteps = Object.values(form.steps)
    .map(it => it.fields || [])
    .flat()
  const fields = Object.keys(form.fields)

  fieldsIncludedInSteps.forEach(it => {
    if (!fields.includes(it)) {
      throw new Error(
        `Field: "${it}" has been used in a step but does not exist in the field configuration, have you exported this in Form Wizard fields?`,
      )
    }
  })
  fields.forEach(it => {
    if (!fieldsIncludedInSteps.includes(it)) {
      throw new Error(
        `Field: "${it}" does not exist in the step configuration, has this field been removed from a page?`,
      )
    }
  })
}

const setupForm = (form: Form, options: BaseFormOptions): FormWizardRouter => {
  const router = express.Router()

  if (form.options.active === true) {
    router.get('/fields', (req: Request, res: Response) => res.json(FormFieldsResponse.from(form, options)))

    router.use((req: Request, res: Response, next: NextFunction) => {
      const { fields = [], section: currentSection } = getStepFrom(form.steps, req.url)

      res.locals.form = {
        fields: fields.filter(fieldCode => !form.fields[fieldCode]?.dependent?.displayInline),
        navigation: createNavigation(form.steps, currentSection),
        sectionProgressRules: createSectionProgressRules(form.steps),
      }

      next()
    })

    checkFormIntegrity(form)

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
