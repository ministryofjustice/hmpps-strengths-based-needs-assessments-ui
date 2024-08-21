/* eslint-disable max-classes-per-file */
declare module 'hmpo-form-wizard' {
  import express from 'express'

  function FormWizard(steps: Steps, fields: Fields, config: FormWizardConfig)

  namespace FormWizard {
    type ConditionFn = (isValidated: boolean, values: Record<string, string | Array<string>>) => boolean
    type SectionProgressRule = { fieldCode: string; conditionFn: ConditionFn }

    type Formatter = { type: string; fn: (input: string) => string }

    interface FormOptions {
      allFields: { [key: string]: Field }
      journeyName: string
      section: string
      sectionProgressRules: Array<SectionProgressRule>
      fields: Fields
      steps: RenderedSteps
      locals: Record<string, boolean | string>
    }

    interface Request extends express.Request {
      form: {
        values: Answers
        options: FormOptions
        persistedAnswers: Answers
      }
      sessionModel: {
        set: (key: string, value: unknown) => void
        get: (key: string) => unknown
      }
    }

    class Controller {
      constructor(options: unknown)

      get(req: Request, res: express.Response, next: express.NextFunction): Promise

      post(req: Request, res: express.Response, next: express.NextFunction): Promise

      configure(req: Request, res: express.Response, next: express.NextFunction): Promise

      process(req: Request, res: express.Response, next: express.NextFunction): Promise

      validate(req: Request, res: express.Response, next: express.NextFunction): Promise

      locals(req: Request, res: express.Response, next: express.NextFunction): Promise

      getValues(req: Request, res: express.Response, next: express.NextFunction): Promise

      saveValues(req: Request, res: express.Response, next: express.NextFunction): Promise

      successHandler(req: Request, res: express.Response, next: express.NextFunction): Promise

      errorHandler(error: Error, req: Request, res: express.Response, next: express.NextFunction): Promise

      setErrors(error: Error, req: Request, res: express.Response)
    }

    namespace Controller {
      export class Error {}
    }

    namespace Field {
      type Option = {
        text: string
        value: string
        checked?: boolean
        conditional?: { html: string }
        hint?: { text: string } | { html: string }
        behaviour?: string
        kind: 'option'
        summary?: {
          displayFn?: (text: string, value: string) => string
        }
      }

      type Divider = {
        divider: string
        kind: 'divider'
      }

      type Options = Array<Option | Divider>
    }

    type AnswerValue = string | number | Array<string | number>

    type FormatterFn = (val: AnswerValue) => AnswerValue

    type Formatter =
      | { type: FormatterType; arguments?: (string | number)[] }
      | { fn: FormatterFn; arguments?: (string | number)[] }

    type ValidatorFn = (val: AnswerValue) => boolean

    type Validate =
      | { type: ValidationType; arguments?: (string | number)[]; message: string }
      | { fn: ValidatorFn; arguments?: (string | number)[]; message: string }

    type Dependent = { field: string; value: string; displayInline?: boolean }

    type Hint = { kind: 'html'; html: string } | { kind: 'text'; text: string }

    interface Field {
      default?: string | number | []
      text: string
      code: string
      id?: string
      hint?: Hint
      type: FieldType
      hidden?: boolean
      multiple?: boolean
      options?: FormWizard.Field.Options
      formatter?: Formatter[]
      validate?: Validate[]
      dependent?: Dependent
      invalidates?: string[]
      value?: string | string[]
      labelClasses?: string
      formGroupClasses?: string
      characterCountMax?: number
      classes?: string
      summary?: {
        displayFn?: (value: string) => string
        displayAlways?: boolean
      }
    }

    interface Fields {
      [key: string]: Field
    }

    namespace Step {
      type NextStepCondition = (req: Request, res: Response) => boolean
      type Op = (fieldValue, req, res, con) => boolean
      type FieldValueCondition = { field: string; op?: string | Op; value: string | string[]; next: NextStep }
      type CallbackCondition = { fn: NextStepCondition; next: string }

      type NextStep = FieldValueCondition | CallbackCondition | string | NextStep[]
    }

    interface BaseStep {
      pageSubHeading?: string
      reset?: boolean
      entryPoint?: boolean
      template?: string
      next?: FormWizard.Step.NextStep
      controller?: typeof FormWizard.Controller
      navigationOrder?: number
      backLink?: string
      sectionProgressRules?: Array<SectionProgressRule>
      noPost?: boolean
      locals?: Record<string, boolean | string>
    }

    interface Step extends BaseStep {
      pageTitle: string
      section: string
      fields?: string[]
    }

    interface RenderedStep extends BaseStep {
      pageTitle: string
      section: string
      fields?: Fields
    }

    interface Steps {
      [key: string]: Step
    }

    interface RenderedSteps {
      [key: string]: RenderedStep
    }

    interface Answers {
      [key: string]: string | string[]
    }
  }

  export default FormWizard
}

/* eslint-enable max-classes-per-file */
