// These enums have to live here because of TS/Jest and Enums work..  ¯\_(ツ)_/¯
// Also this ESLint override because of how TS/Eslint works.
// eslint-disable-next-line no-shadow
export const enum FieldType {
  Text = 'TEXT',
  Radio = 'RADIO',
  CheckBox = 'CHECKBOX',
  TextArea = 'TEXT_AREA',
  Date = 'DATE',
  Dropdown = 'DROPDOWN',
  Hidden = 'HIDDEN',
  AutoComplete = 'AUTOCOMPLETE',
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

// eslint-disable-next-line no-shadow
export const enum Gender {
  NotKnown = 0,
  Male = 1,
  Female = 2,
  NotSpecified = 9,
}
