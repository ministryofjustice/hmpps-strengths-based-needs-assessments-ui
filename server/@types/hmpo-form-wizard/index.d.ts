declare module 'hmpo-form-wizard' {
  import { Request, Response, NextFunction } from 'express'

  // This enum has to live here because of TS/Jest and Enums work..  ¯\_(ツ)_/¯
  // Also this ESLint override because of how TS/Eslint work..
  // eslint-disable-next-line no-shadow
  export const enum FieldType {
    Text = 'text',
    Radio = 'radio',
    CheckBox = 'checkbox',
    TextArea = 'text-area',
  }

  function FormWizard(steps: Steps, fields: Fields, config: FormWizardConfig)

  namespace FormWizard {
    class Controller {
      locals(req: Request, res: Response, next: NextFunction): Promise
    }

    interface Config {
      journeyName: string
      journeyPageTitle: string
      name: string
      entryPoint: boolean
    }

    namespace Field {
      interface Option {
        text: string
        value: string
      }

      type Options = Option[]
    }

    interface Field {
      default?: string | number | []
      text: string
      code: string
      hint?: string
      type: FieldType
      options?: FormWizard.Field.Options
    }

    interface Fields {
      [key: string]: Field
    }

    interface Step {
      pageTitle: string
      reset?: boolean = false
      entryPoint?: boolean = false
      template: string
      next?: string
      fields?: string[] = []
      controller?: typeof FormWizard.Controller
    }

    interface Steps {
      [key: string]: Step
    }
  }

  export default FormWizard
}
