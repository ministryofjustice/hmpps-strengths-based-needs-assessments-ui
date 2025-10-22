import FormWizard from 'hmpo-form-wizard'
import AnswersProvider, { Field } from './AnswersProvider'
import { isPractitionerAnalysisField } from './field.utils'

export default class FieldMapper {
  private readonly allFields: Record<string, FormWizard.Field>

  private readonly answersProvider: AnswersProvider

  private stepFieldsFilterFn: (field: FormWizard.Field) => boolean = () => true

  constructor(allFields: Record<string, FormWizard.Field>, answersProvider: AnswersProvider) {
    this.allFields = allFields
    this.answersProvider = answersProvider
  }

  setStepFieldsFilterFn(fn: (field: FormWizard.Field) => boolean) {
    this.stepFieldsFilterFn = fn
  }

  getStepFieldsFilterFn() {
    return this.stepFieldsFilterFn
  }

  toStepFields(stepPath: string) {
    return (fields: Field[], fieldToAdd: FormWizard.Field): Field[] => {
      const field = {
        ...fieldToAdd,
        text: fieldToAdd.summary?.text ? fieldToAdd.summary.text : fieldToAdd.text,
      }

      if (field.dependent) {
        this.addNestedField(field, fields, stepPath)
        return fields
      }

      if (field.collection) {
        const entries = ((this.answersProvider.getRawAnswers()[field.code] || []) as FormWizard.CollectionEntry[]).map(
          (entry, index) => {
            this.answersProvider.setOverride(entry)
            const entryFields = field.collection.fields
              .map(it => this.allFields[it.code])
              .reduce(this.toStepFields(`${field.collection.updateUrl}/${index}`), [])
            this.answersProvider.clearOverride()
            return {
              text: field.text,
              value: '',
              nestedFields: entryFields,
            }
          },
        )

        return [
          ...fields,
          {
            field,
            changeLink: `${stepPath}#${field.id || field.code}`,
            answers: entries,
          },
        ]
      }

      return [
        ...fields,
        {
          field,
          changeLink: isPractitionerAnalysisField(field.code)
            ? `${stepPath}#practitioner-analysis`
            : `${stepPath}#${field.id || field.code}`,
          answers: this.answersProvider.getFieldAnswers(field),
        },
      ]
    }
  }

  addNestedField(fieldToNest: FormWizard.Field, fieldsAtCurrentDepth: Field[], stepPath: string): boolean {
    const parentFieldAtCurrentDepth = fieldsAtCurrentDepth.find(f => f.field.id === fieldToNest.dependent.field)

    if (parentFieldAtCurrentDepth) {
      const answer = parentFieldAtCurrentDepth.answers.find(it => it.value === fieldToNest.dependent.value)
      if (answer !== undefined) {
        answer.nestedFields.push({
          field: fieldToNest,
          changeLink: `${stepPath}#${fieldToNest.id}`,
          answers: this.answersProvider.getFieldAnswers(fieldToNest),
        })
        return true
      }
    }

    const tryNestingDeeper = (field: Field) =>
      field.answers.some(answer => this.addNestedField(fieldToNest, answer.nestedFields, stepPath))
    return fieldsAtCurrentDepth.some(tryNestingDeeper)
  }
}
