import FormWizard from 'hmpo-form-wizard'
import { validate, Context, ValidationError } from 'hmpo-form-wizard/lib/validation'
import { dependencyMet } from './field.utils'
import { FieldType } from '../../server/@types/hmpo-form-wizard/enums'
import { ordinalWordFromNumber } from './formatters'

const errorFrom = (from: ValidationError): FormWizard.Controller.Error =>
  new FormWizard.Controller.Error(
    from.key,
    { errorGroup: from.errorGroup, type: from.type, message: from.message },
    null,
  )

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
  if (!entries || entries.length === 0) {
    return new FormWizard.Controller.Error(
      collectionField.code,
      { message: `Add one or more ${collectionField.collection.subject}s` },
      null,
    )
  }

  const fieldsInCollection = Object.fromEntries(collectionField.collection.fields.map(it => [it.code, it]))
  const allEntryErrors = entries.reduce(
    (errors: FormWizard.Controller.Errors, entry, i): FormWizard.Controller.Errors => {
      const entryErrors = collectionField.collection.fields
        .filter(it => dependencyMet(it, entry))
        .map(field =>
          validateField(fieldsInCollection, field.id || field.code, entry[field.code], {
            values: entry,
          }),
        )
        .filter(it => it !== null)

      if (entryErrors.length) {
        const error = new FormWizard.Controller.Error(
          `${collectionField.code}-entry-${i}`,
          {
            message: `The ${ordinalWordFromNumber(i + 1)} ${collectionField.collection.subject} details are invalid`,
          },
          null,
        )
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

  const collectionError = Object.keys(allEntryErrors).length
    ? new FormWizard.Controller.Error(collectionField.code, {}, null)
    : null

  if (collectionError) {
    collectionError.messageGroup = allEntryErrors
  }

  return collectionError
}
