import * as express from 'express'
import { Request, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'

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

const setupForm = (form: Form) => {
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

export { setupForm, checkFormIntegrity }
