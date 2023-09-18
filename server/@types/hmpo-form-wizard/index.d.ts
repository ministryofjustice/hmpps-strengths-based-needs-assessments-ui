declare module 'hmpo-form-wizard' {
  import express from 'express'

  // These enums have to live here because of TS/Jest and Enums work..  ¯\_(ツ)_/¯
  // Also this ESLint override because of how TS/Eslint work..
  // eslint-disable-next-line no-shadow
  export const enum FieldType {
    Text = 'TEXT',
    Radio = 'RADIO',
    CheckBox = 'CHECKBOX',
    TextArea = 'TEXT_AREA',
    Date = 'DATE',
    Dropdown = 'DROPDOWN',
    Collection = 'COLLECTION',
  }

  // eslint-disable-next-line no-shadow
  export const enum ValidationType {
    String = 'string',
    Regex = 'regex',
    Required = 'required',
    Email = 'email',
    MinLength = 'minlength',
    MaxLength = 'maxlength',
    ExactLength = 'exactlength',
    Alpha = 'alpha',
    AlphaEx = 'alphaex',
    AlphaEx1 = 'alphaex1',
    Alphanumeric = 'alphanum',
    AlphanumericEx = 'alphanumex',
    AlphanumericEx1 = 'alphanumex1',
    Numeric = 'numeric',
    Equal = 'equal',
    PhoneNumber = 'phonenumber',
    UKMobileNumber = 'ukmobilephone',
    Date = 'date',
    DateYear = 'date-year',
    DateMonth = 'date-month',
    DateDay = 'date-day',
    BeforeDate = 'before',
    AfterDate = 'after',
    Postcode = 'postcode',
    Match = 'match',
    BeforeDateField = 'beforeField',
    AfterDateField = 'afterField',
  }

  // eslint-disable-next-line no-shadow
  export const enum FormatterType {
    Trim = 'trim',
    Boolean = 'boolean',
    Uppercase = 'uppercase',
    Lowercase = 'lowercase',
    RemoveSpaces = 'removespaces',
    SingleSpaces = 'singlespaces',
    Hyphens = 'hyphens',
    Apostrophes = 'apostrophes',
    Quotes = 'quotes',
    RemoveRoundBrackets = 'removeroundbrackets',
    RemoveHyphens = 'removehyphens',
    RemoveSlashes = 'removeslashes',
    UKPhonePrefix = 'ukphoneprefix',
    Base64Decode = 'base64decode',
  }

  function FormWizard(steps: Steps, fields: Fields, config: FormWizardConfig)

  namespace FormWizard {
    interface Request extends express.Request {
      form: {
        values: { [key: string]: string | string[] }
        options: {
          allFields: { [key: string]: Field }
          journeyName: string
        }
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

      locals(req: Request, res: express.Response, next: express.NextFunction): Promise

      saveValues(req: Request, res: express.Response, next: express.NextFunction): Promise

      successHandler(req: Request, res: express.Response, next: express.NextFunction): Promise
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
        checked?: boolean
        conditional?: { html: string }
        hint?: { text: string } | { html: string }
      }

      type Options = Option[]
    }

    type AnswerValue = string | number | (string | number)[]

    type FormatterFn = (val: AnswerValue) => AnswerValue

    type Formatter =
      | { type: FormatterType; arguments?: (string | number)[] }
      | { fn: FormatterFn; arguments?: (string | number)[] }

    type ValidatorFn = (val: AnswerValue) => boolean

    type Validate =
      | { type: ValidationType; arguments?: (string | number)[]; message: string }
      | { fn: ValidatorFn; arguments?: (string | number)[]; message: string }

    type Dependent = { field: string; value: string; displayInline?: boolean }

    interface Field {
      default?: string | number | []
      text: string
      code: string
      hint?: string
      type: FieldType
      multiple?: boolean
      options?: FormWizard.Field.Option[]
      formatter?: Formatter[]
      validate?: Validate[]
      dependent?: Dependent
      invalidates?: string[]
      value?: string | string[]
      useSmallLabel?: boolean
    }

    interface Fields {
      [key: string]: Field
    }

    type NextStepCondition = (req: Request, res: Response) => boolean

    type NextStep =
      | { field: string; op?: string; value: string; next: string | NextStep[] }
      | { fn: NextStepCondition; next: string }
      | string

    interface Step {
      pageTitle: string
      reset?: boolean
      entryPoint?: boolean
      template?: string
      next?: string | NextStep[]
      fields?: string[]
      controller?: typeof FormWizard.Controller
      navigationOrder?: number
    }

    interface Steps {
      [key: string]: Step
    }

    interface Answers {
      [key: string]: string | string[]
    }
  }

  export default FormWizard
}
