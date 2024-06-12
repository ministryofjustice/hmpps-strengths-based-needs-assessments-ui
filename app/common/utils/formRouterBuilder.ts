import type { NextFunction, Request, Response } from 'express'
import * as express from 'express'
import FormWizard from 'hmpo-form-wizard'
import FormFieldsResponse from '../responses/formFieldsResponse'
import { Form, FormOptions } from '../form-types'

type FormWizardRouter = {
  metaData: FormOptions
  router: express.Router
  configRouter: express.Router
}

const getLatestVersionFrom = (formRouters: FormWizardRouter[] = []): FormWizardRouter | null =>
  formRouters.reduce(
    (latest, it) => (!latest || (it.metaData.active && it.metaData.version > latest.metaData.version) ? it : latest),
    null,
  )

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

const setupForm = (form: Form): FormWizardRouter => {
  const router = express.Router()
  const configRouter = express.Router()
  const options = {
    journeyName: 'sbna',
    journeyTitle: 'Strengths and needs',
    entryPoint: true,
  }

  if (form.options.active === true) {
    router.get('/fields', (_req: Request, res: Response) => res.json(FormFieldsResponse.from(form, options))) // TODO: remove
    configRouter.get('/', (_req: Request, res: Response) => res.json(FormFieldsResponse.from(form, options)))

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

  return { metaData: form.options, router, configRouter }
}

export default class FormRouterBuilder {
  formRouter?: express.Router = express.Router()

  formConfigRouter?: express.Router = express.Router()

  constructor(routers: FormWizardRouter[], latest: FormWizardRouter) {
    routers
      .filter((formRouter: FormWizardRouter) => formRouter.metaData.active)
      .forEach(formRouter => {
        const [majorVersion, minorVersion] = formRouter.metaData.version.split('.')
        this.formRouter.use(`/${majorVersion}/${minorVersion}`, formRouter.router)
        this.formConfigRouter.use(`/${majorVersion}/${minorVersion}`, formRouter.configRouter)
      })
    if (latest) {
      this.formRouter.use('/', latest.router) // TODO: Clean-up - remove
      this.formConfigRouter.use('/latest', latest.configRouter)
    }
  }

  static configure(...formVersions: Form[]) {
    const formRouters: FormWizardRouter[] = formVersions.map(form => setupForm(form))
    return new FormRouterBuilder(formRouters, getLatestVersionFrom(formRouters))
  }
}
