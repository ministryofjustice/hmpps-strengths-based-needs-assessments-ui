import type { Request, Response } from 'express'
import * as express from 'express'
import FormWizard from 'hmpo-form-wizard'
import HttpError from '../../server/errors/httpError'

export type FormWizardRouter = {
  metaData: FormOptions
  router: express.Router
  configRouter: express.Router
}

export type FormOptions = {
  version: string
  active: boolean
  defaultFormatters: Array<string | FormWizard.Formatter>
}

export type Form = {
  fields: FormWizard.Fields
  steps: FormWizard.Steps
  options: FormOptions
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
  section: string
  label: string
  active: boolean
}

export const getLastStepOfSection = (steps: FormWizard.Steps, sectionName: string) =>
  Object.entries(steps).find(([_path, step]) => step.section === sectionName && step.isLastStep)[0]

export const createNavigation = (
  baseUrl: string,
  steps: FormWizard.Steps,
  currentSection: string,
  isInEditMode: boolean,
): Array<NavigationItem> => {
  return Object.entries(steps)
    .filter(([_path, config]) => config.navigationOrder)
    .sort(([_pathA, configA], [_pathB, configB]) => configA.navigationOrder - configB.navigationOrder)
    .map(([path, config]) => {
      const url = isInEditMode ? `${path}?action=resume` : getLastStepOfSection(steps, config.section)

      return {
        url: `${baseUrl}/${url.slice(1)}`,
        section: config.section,
        label: config.pageTitle,
        active: config.section === currentSection,
      }
    })
}

type SectionCompleteRule = { sectionName: string; fieldCodes: Array<string> }

export const createSectionProgressRules = (steps: FormWizard.Steps): Array<SectionCompleteRule> => {
  const sectionRules: Record<string, string[]> = Object.values(steps)
    .map((step): [string, Array<string>] => [step.section, (step.sectionProgressRules || []).map(it => it.fieldCode)])
    .filter(([sectionName]) => sectionName !== 'none')
    .reduce(
      (sections, [sectionName, rules]) => ({
        ...sections,
        [sectionName]: [...(sections[sectionName] || []), ...rules],
      }),
      {} as Record<string, string[]>,
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
  const router = express.Router({ mergeParams: true })
  const configRouter = express.Router()

  if (form.options.active === true) {
    configRouter.get('/', (_req: Request, res: Response) => {
      res.json({
        version: form.options.version,
        fields: form.fields,
      })
    })

    checkFormIntegrity(form)

    router.use((req, _res, next) => {
      const isValidMode = /^(view|edit)$/.test(req.params.mode)
      if (!isValidMode) throw new HttpError(req, 404)
      next()
    })

    router.use(
      FormWizard(form.steps, form.fields, {
        name: `Assessment:${form.options.version}`,
        entryPoint: true,
        defaultFormatters: form.options.defaultFormatters,
      }),
    )
  }

  return { metaData: form.options, router, configRouter }
}

export default class FormRouterBuilder {
  formRouters: Record<string, FormWizardRouter>
  formConfigRouter?: express.Router = express.Router()

  constructor(routers: Record<string, FormWizardRouter>, latest: FormWizardRouter) {
    this.formRouters = routers

    Object.values(routers)
      .filter((formRouter: FormWizardRouter) => formRouter.metaData.active)
      .forEach(formRouter => {
        const [majorVersion, minorVersion] = formRouter.metaData.version.split('.')
        this.formConfigRouter.use(`/${majorVersion}/${minorVersion}`, formRouter.configRouter)
      })
    if (latest) {
      this.formConfigRouter.use('/latest', latest.configRouter)
    }
  }

  static configure(...formVersions: Form[]) {
    const formRouters: Record<string, FormWizardRouter> = Object.fromEntries(formVersions.map(form => [form.options.version, setupForm(form)]))
    return new FormRouterBuilder(formRouters, getLatestVersionFrom(Object.values(formRouters)))
  }
}
