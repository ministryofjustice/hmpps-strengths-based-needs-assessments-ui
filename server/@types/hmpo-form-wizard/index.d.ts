/* eslint-disable max-classes-per-file */
declare module 'hmpo-form-wizard' {
  import express from 'express'

  function FormWizard(steps: Steps, fields: Fields, config: FormWizardConfig)

  namespace FormWizard {
    type ConditionFn = (isValidated: boolean, values: Record<string, Answer>) => boolean
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

    type ValidateFieldsCallback = (errors: FormWizard.Controller.Errors) => Promise

    class Controller {
      constructor(options: unknown)

      get(req: Request, res: express.Response, next: express.NextFunction): Promise

      post(req: Request, res: express.Response, next: express.NextFunction): Promise

      configure(req: Request, res: express.Response, next: express.NextFunction): Promise

      process(req: Request, res: express.Response, next: express.NextFunction): Promise

      validateFields(req: Request, res: express.Response, callback: ValidateFieldsCallback): Promise

      validate(req: Request, res: express.Response, next: express.NextFunction): Promise

      getErrors(req: Request, res: express.Response): Controller.Errors

      locals(req: Request, res: express.Response, next: express.NextFunction): Promise

      getValues(req: Request, res: express.Response, next: express.NextFunction): Promise

      saveValues(req: Request, res: express.Response, next: express.NextFunction): Promise

      successHandler(req: Request, res: express.Response, next: express.NextFunction): Promise

      errorHandler(error: Error, req: Request, res: express.Response, next: express.NextFunction): Promise

      setErrors(error: Error, req: Request, res: express.Response)
    }

    namespace Controller {
      export interface ErrorOptions {
        key?: string
        errorGroup?: unknown
        field?: unknown
        type?: string
        redirect?: unknown
        message?: string
        messageGroup?: Errors
        headerMessage?: string
        arguments?: string | string[]
      }

      export class Error {
        key: string

        errorGroup: unknown

        field: unknown

        type: string

        redirect: unknown

        url: string

        message: string

        messageGroup: Errors

        headerMessage: string

        args: Record<string, unknown>

        constructor(key: string, options: ErrorOptions, req: Request)
      }

      export type Errors = Record<string, Error>
    }

    namespace Field {
      type Option = {
        text: string
        value: string
        checked?: boolean
        selected?: boolean
        disabled?: boolean
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
      value?: FormWizard.An
      collection?: {
        fields: FormWizard.Field[]
        subject: string
        createUrl: string
        updateUrl: string
        deleteUrl: string
        summaryUrl: string
      }
      labelClasses?: string
      formGroupClasses?: string
      classes?: string
      summary?: {
        displayFn?: (value: string) => string
        displayAlways?: boolean
      }
      transform?: (CookieSessionObject) => FormWizard.Field
    }

    interface Fields {
      [key: string]: Field
    }

    namespace Step {
      type NextStepCondition = (req: Request, res: express.Response, next: express.NextFunction) => boolean
      type Op = (fieldValue, req, res, con) => boolean
      type FieldValueCondition = { field: string; op?: string | Op; value: string | string[]; next: NextStep }
      type CallbackCondition = { fn: NextStepCondition; next: string }

      type NextStep = FieldValueCondition | CallbackCondition | string | NextStep[]
    }

    type SecondaryAction = { text: string; url: string }

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
      secondaryActions?: SecondaryAction[]
      autosave?: boolean
      isLastStep?: boolean
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

    type CollectionEntry = Record<string, string | string[]>

    type SimpleAnswer = string | string[]

    type Answer = SimpleAnswer | CollectionEntry[]

    type Answers = Record<string, Answer>
  }

  export default FormWizard
}

/* eslint-enable max-classes-per-file */
