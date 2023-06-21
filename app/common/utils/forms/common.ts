import FormWizard from 'hmpo-form-wizard'
import * as express from 'express'

export type FormWizardRouter = {
  metaData: FormOptions
  router: express.Router
}

export type FormVersionInformation = {
  version: string
  active: boolean
}

export type BaseFormOptions = {
  journeyName: string
  journeyTitle: string
  entryPoint?: boolean
}

export type FormOptions = {
  version: string
  tag: string
  active: boolean
}

export type Form = {
  fields: FormWizard.Fields
  steps: FormWizard.Steps
  options: FormOptions
}

export const getLatestVersionFrom = (formRouters: FormWizardRouter[] = []): FormWizardRouter | null =>
  formRouters.reduce(
    (latest, it) => (!latest || (it.metaData.active && it.metaData.version > latest.metaData.version) ? it : latest),
    null,
  )
