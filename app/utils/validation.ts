import FormWizard from 'hmpo-form-wizard'
import { validate, Context, ValidationError } from 'hmpo-form-wizard/lib/validation'
import { ordinalWordFromNumber } from '../../server/utils/nunjucks.utils'
import { dependencyMet } from './field.utils'
import { FieldType } from '../../server/@types/hmpo-form-wizard/enums'

const errorFrom = (from: ValidationError): FormWizard.Controller.Error => {
  const error = new FormWizard.Controller.Error()
  error.key = from.key
  error.errorGroup = from.errorGroup
  error.type = from.type
  error.message = from.message
  return error
}

export const validateField = (
  fields: FormWizard.Fields,
  key: string,
  value: FormWizard.Answer,
  context: Context,
): FormWizard.Controller.Error => {
  if (fields[key].type === FieldType.Collection) {
    return validateCollectionField(fields[key], context.values[key] as FormWizard.CollectionEntry[])
  }
  const validationError = validate(fields, key, value as FormWizard.SimpleAnswer, context)
  return validationError ? errorFrom(validationError) : null
}

export const validateCollectionField = (collectionField: FormWizard.Field, entries: FormWizard.CollectionEntry[]) => {
  if (entries.length === 0) {
    const collectionError = new FormWizard.Controller.Error()
    collectionError.key = collectionField.code
    collectionError.message = `Add one or more ${collectionField.collection.subject}s`
    return collectionError
  }

  const fieldsInCollection = Object.fromEntries(collectionField.collection.fields.map(it => [it.code, it]))
  const allEntryErrors = entries.reduce(
    (errors: FormWizard.Controller.Errors, entry, i): FormWizard.Controller.Errors => {
      const entryErrors = collectionField.collection.fields
        .filter(it => dependencyMet(it, entry))
        .map(field =>
          validateField(fieldsInCollection, field.code, entry[field.code], {
            values: entry,
          }),
        )
        .filter(it => it !== null)

      if (entryErrors.length) {
        const error = new FormWizard.Controller.Error()
        error.key = `${collectionField.code}-entry-${i}`
        error.message = `The ${ordinalWordFromNumber(i + 1)} ${collectionField.collection.subject} details are invalid`
        error.messageGroup = Object.fromEntries(entryErrors.map(it => [it.key, it]))
        return {
          ...errors,
          [`entry-${i}`]: error,
        }
      }
      return errors
    },
    {} as FormWizard.Controller.Errors,
  )

  const collectionError = new FormWizard.Controller.Error()
  collectionError.key = collectionField.code
  collectionError.message = ''
  collectionError.messageGroup = allEntryErrors
  return Object.keys(allEntryErrors).length ? collectionError : null
}
