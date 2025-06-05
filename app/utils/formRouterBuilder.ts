import type { Request, Response } from 'express'
import * as express from 'express'
import FormWizard from 'hmpo-form-wizard'

import { Section } from '../form/common/section';
import { Form, FormOptions, formVersions } from '../form';

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

export const getSections = (formVersion: string): Record<string, Section> =>
  formVersions[formVersion].sections

const removeQueryParamsFrom = (urlWithParams: string) => {
  const [url] = urlWithParams.split('?')
  return url
}

interface NavigationItem {
  url: string
  section: string
  label: string
  active: boolean
  subNavigation?: Array<NavigationItem>
}

export const createNavigation = (
  baseUrl: string,
  sections: Record<string, Section>,
  steps: FormWizard.Steps,
  stepUrl: string,
  isInEditMode: boolean,
): Array<NavigationItem> => {
  return Object.values(sections)
    .map(section => {
      const url = isInEditMode ? `${getFirstStepOfSection(section)}?action=resume` : getLastStepOfSection(section)
      return {
        url: `${baseUrl}/${url}`,
        section: section.code,
        label: section.title,
        active: isSectionActive(stepUrl, section),
        subNavigation: section.subSections ? createNavigation(baseUrl, section.subSections, steps, stepUrl, isInEditMode) : null,
      }
    })
}

const isSectionActive = (stepUrl: string, section: Section): boolean =>
  Object.values(section.stepUrls || []).some(it => it === stepUrl) || Object.values(section.subSections || []).some(it => isSectionActive(stepUrl, it))

export const getFirstStepOfSection = (section: Section): string =>
  section.stepUrls ? Object.values(section.stepUrls).at(0) : getFirstStepOfSection(Object.values(section.subSections).at(0))

export const getLastStepOfSection = (section: Section): string =>
  section.stepUrls ? Object.values(section.stepUrls).at(-1) : getLastStepOfSection(Object.values(section.subSections).at(-1))

export const findSectionByCode = (code: string, sections: Record<string, Section>): Section | null => {
  for (const section of Object.values(sections)) {
    if (section.code === code) return section
    if (section.subSections) {
      const found = findSectionByCode(code, section.subSections)
      if (found) return found
    }
  }
  return null
}

export const findSectionByStepUrl = (stepUrl: string, sections: Record<string, Section>): Section | null => {
  for (const section of Object.values(sections)) {
    if (Object.values(section.stepUrls || []).some(it => it === stepUrl)) return section
    if (section.subSections) {
      const found = findSectionByStepUrl(stepUrl, section.subSections)
      if (found) return found
    }
  }
  return null
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
  const router = express.Router()
  const configRouter = express.Router()

  if (form.options.active === true) {
    configRouter.get('/', (_req: Request, res: Response) => {
      res.json({
        version: form.options.version,
        fields: form.fields,
      })
    })

    checkFormIntegrity(form)

    router.use(
      FormWizard(form.steps, form.fields, {
        name: `Assessment:${form.options.version}`,
        entryPoint: true,
        sections: form.sections,
        defaultFormatters: form.options.defaultFormatters,
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
      this.formConfigRouter.use('/latest', latest.configRouter)
    }
  }

  static configure(...formVersions: Form[]) {
    const formRouters: FormWizardRouter[] = formVersions.map(form => setupForm(form))
    return new FormRouterBuilder(formRouters, getLatestVersionFrom(formRouters))
  }
}
