/* eslint-disable import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires */
import FormWizard from 'hmpo-form-wizard'
import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import fs, { Dirent } from 'fs'

export interface FormOptions {
  journeyName: string
  journeyTitle: string
  version: string
  entryPoint?: boolean
  active?: boolean
  tag: string
}

export interface FormRouter {
  version: string
  active: boolean
  router: Router
  tag: string
}

export const setupForm = (steps: FormWizard.Steps, fields: FormWizard.Fields, options: FormOptions): FormRouter => {
  const router = Router()

  if (options.active === true) {
    router.get('/fields', (req: Request, res: Response) =>
      res.json({ name: options.journeyName, title: options.journeyTitle, version: options.version, fields }),
    )
    router.use(
      FormWizard(steps, fields, {
        journeyName: `${options.journeyName}:${options.version}`,
        journeyPageTitle: options.journeyTitle,
        name: `${options.journeyName}:${options.version}`,
        entryPoint: options.entryPoint || false,
      }),
    )
  }

  return { version: options.version, tag: options.tag, active: options.active || false, router }
}

type FormVersionInformation = {
  version: string
  active: boolean
}

type FormVersionResponse = {
  latest: string
  available: FormVersionInformation[]
}

type BaseFormOptions = {
  journeyName: string
  journeyTitle: string
  entryPoint?: boolean
}

type FormConfigOptions = {
  version: string
  tag: string
  active: boolean
}

type FormConfig = {
  fields: FormWizard.Fields
  steps: FormWizard.Steps
  options: FormConfigOptions
}

const mountRouter = (r: Router) => (form: FormRouter) => {
  const [majorVersion, minorVersion] = form.version.split('.')
  r.use(`/${majorVersion}/${minorVersion}`, form.router)
}
const getLatestVersionFrom = (formRouterConfig: FormRouter[]): FormRouter | null =>
  formRouterConfig.reduce(
    (latest, current) => (!latest || (current.active && current?.version > latest?.version) ? current : latest),
    null,
  )
const getActiveFormVersionsFrom = (formRouterConfig: FormRouter[]): string[] =>
  formRouterConfig.filter((form: FormRouter) => form.active).map((form: FormRouter) => form.version.toString())

export const bootstrapFormConfiguration = (forms: FormConfig[], options: BaseFormOptions): Router => {
  const router = Router()
  const formRouters: FormRouter[] = forms.map(form =>
    setupForm(form.steps, form.fields, { ...form.options, ...options }),
  )
  const latestForm: FormRouter = getLatestVersionFrom(formRouters)
  const formVersionResponse: FormVersionResponse = {
    latest: latestForm?.version || null,
    available: formRouters.map(form => ({
      version: form.version,
      active: form.active,
      tag: form.tag,
    })),
  }

  formRouters.filter((form: FormRouter) => form.active).forEach(mountRouter(router))

  router.use('/versions', (req: Request, res: Response) => res.json(formVersionResponse))

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    // eventually this would be replaced by what we receive when getting the version for an existing assessment
    // for now we can just override defaulting to latest for testing
    const selectedVersion = req.query.version?.toString()

    if (!selectedVersion || selectedVersion === latestForm.version.toString()) {
      return res.redirect(`${req.baseUrl}/start`)
    }

    if (selectedVersion && getActiveFormVersionsFrom(formRouters).includes(selectedVersion)) {
      const [majorVersion, minorVersion] = selectedVersion.split('.')
      return res.redirect(`${req.baseUrl}/${majorVersion}/${minorVersion}/start`)
    }

    return next(new Error('Invalid form version'))
  })

  if (latestForm) {
    router.use('/', latestForm.router)
  }

  return router
}

const dirRegex = /v(\d*)_(\d*)__([a-zA-Z0-9_-]*)/

export const loadFormsInDirectory = (baseDir: string): FormConfig[] =>
  fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((fsEntry: Dirent): boolean => fsEntry.isDirectory() && dirRegex.test(fsEntry.name))
    .map((directory: Dirent): FormConfig => {
      const versionDetails: string[] = dirRegex.exec(directory.name).slice(1)
      const [major, minor, tag] = versionDetails
      const formConfiguration = require(`${baseDir}/${directory.name}`).default
      return {
        steps: formConfiguration.steps,
        fields: formConfiguration.fields,
        options: {
          ...formConfiguration.options,
          version: `${major}.${minor}`,
          tag: tag.replace(/[_-]/gm, ' '),
        },
      }
    })

export default { setupForm, bootstrapFormConfiguration }
