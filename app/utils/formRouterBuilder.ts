import * as express from 'express'
import { Request } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { HandoverPrincipal } from '../../server/services/arnsHandoverService'
import { Form, FormOptions, setupForm } from './formRouter/SetupForm'

export type FormWizardRouter = {
  metaData: FormOptions
  router: express.Router
  configRouter: express.Router
}

export type SectionCompleteRule = { sectionName: string; fieldCodes: Array<string> }

export const createSectionProgressRules = (steps: FormWizard.Steps): Array<SectionCompleteRule> => {
  // turn all steps into a tuple of `[sectionName, fieldCodes]` for each section
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

  // running sectionRules through Set removes the duplicate fieldCodes
  return Object.entries(sectionRules).map(([sectionName, fieldCodes]) => ({
    sectionName,
    fieldCodes: [...new Set(fieldCodes)],
  }))
}

export const isInEditMode = (user: HandoverPrincipal, req: Request) =>
  user.accessMode === 'READ_WRITE' && req.params.mode === 'edit'

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
    const formRouters: Record<string, FormWizardRouter> = Object.fromEntries(
      formVersions.map(form => [form.options.version, setupForm(form)]),
    )
    return new FormRouterBuilder(
      formRouters,
      Object.values(formRouters).reduce(
        (latest, it) =>
          !latest || (it.metaData.active && it.metaData.version > latest.metaData.version) ? it : latest,
        null,
      ),
    )
  }
}
