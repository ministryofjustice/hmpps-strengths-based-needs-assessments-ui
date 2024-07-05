import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { formatDateForDisplay } from '../../server/utils/nunjucks.utils'
import { whereSelectable } from './field.utils'

export interface Field {
  field: FormWizard.Field
  changeLink: string
  answers: FieldAnswer[]
}

export interface FieldAnswer {
  text: string
  value: string
  nestedFields: Field[]
}

type StepFieldsFilterFn = (field: FormWizard.Field) => boolean
const hasProperty = (a: object, b: string) => Object.prototype.hasOwnProperty.call(a, b)

export class FieldDependencyTreeBuilder {
  private readonly options: FormWizard.FormOptions

  private readonly answers: FormWizard.Answers

  private stepFieldsFilterFn: StepFieldsFilterFn = () => true

  constructor(options: FormWizard.FormOptions, answers: FormWizard.Answers) {
    this.options = options
    this.answers = answers
  }

  setStepFieldsFilterFn(filterFn: StepFieldsFilterFn) {
    this.stepFieldsFilterFn = filterFn
    return this
  }

  /*
    Starting with `step` and `path`,
    applies the FormWizard step logic recursively to build the user journey as an array of steps
   */
  protected getSteps(
    step: FormWizard.RenderedStep,
    path: string,
    acc: [string, FormWizard.RenderedStep][] = [],
  ): [string, FormWizard.RenderedStep][] {
    if (step === undefined || step.section !== this.options.section) return acc
    acc.push([path.replace(/^\//, ''), step])
    const nextStep = this.resolveNextStep(step.next) as string
    if (nextStep === undefined) return acc
    const nextStepPath = `/${nextStep.split('#')[0]}`
    return this.getSteps(this.options.steps[nextStepPath], nextStepPath, acc)
  }

  /*
    Resolves the next step given a `next` FormWizard step criteria
   */
  protected resolveNextStep(next: FormWizard.Step.NextStep): FormWizard.Step.NextStep {
    if (next === undefined || typeof next === 'string') {
      return next
    }

    if (hasProperty(next, 'field') && hasProperty(next, 'value')) {
      const con = next as FormWizard.Step.FieldValueCondition
      const conditionMet = (condition: string | string[]) => (value: string) =>
        Array.isArray(condition) ? condition.includes(value) : condition === value
      return this.getAnswers(con.field)?.some(conditionMet(con.value)) ? this.resolveNextStep(con.next) : undefined
    }

    if (hasProperty(next, 'fn')) {
      const con = next as FormWizard.Step.CallbackCondition
      throw new Error(`unable to resolve ${con.next} - callbacks are not supported yet`)
    }

    if (Array.isArray(next)) {
      return next.reduce((result, it) => result || this.resolveNextStep(it), undefined)
    }

    return undefined
  }

  /*
    Converts FormWizard fields to Field objects and adds them to the dependency tree
   */
  protected toStepFields(stepPath: string) {
    return (fields: Field[], field: FormWizard.Field): Field[] => {
      if (field.dependent) {
        this.addNestedField(field, fields, stepPath)
        return fields
      }
      return [
        ...fields,
        {
          field,
          changeLink: `${stepPath}#${field.id}`,
          answers: this.getFieldAnswers(field),
        },
      ]
    }
  }

  /*
    Adds a dependent field to the answer where the condition is met.
   */
  protected addNestedField(fieldToNest: FormWizard.Field, fieldsAtCurrentDepth: Field[], stepPath: string): boolean {
    const parentFieldAtCurrentDepth = fieldsAtCurrentDepth.find(f => f.field.id === fieldToNest.dependent.field)

    if (parentFieldAtCurrentDepth) {
      const answer = parentFieldAtCurrentDepth.answers.find(it => it.value === fieldToNest.dependent.value)
      if (answer !== undefined) {
        answer.nestedFields.push({
          field: fieldToNest,
          changeLink: `${stepPath}#${fieldToNest.id}`,
          answers: this.getFieldAnswers(fieldToNest),
        })
        return true
      }
    }

    const tryNestingDeeper = (field: Field) =>
      field.answers.some(answer => this.addNestedField(fieldToNest, answer.nestedFields, stepPath))
    return fieldsAtCurrentDepth.some(tryNestingDeeper)
  }

  /*
    Gets the formatted answer(s) for a given field
   */
  protected getFieldAnswers(field: FormWizard.Field): FieldAnswer[] {
    switch (field.type) {
      case FieldType.Radio:
      case FieldType.Dropdown:
      case FieldType.CheckBox:
        return field.options
          .filter(o => whereSelectable(o) && this.getAnswers(field.code)?.includes(o.value))
          .map(o => {
            return {
              text: whereSelectable(o) ? o.summary?.displayFn(o.text, o.value) || o.text : '',
              value: whereSelectable(o) ? o.value : '',
              nestedFields: [],
            } as FieldAnswer
          })
      case FieldType.Date:
        return [
          {
            text: field.summary?.displayFn
              ? field.summary?.displayFn(this.answers[field.code] as string)
              : formatDateForDisplay(this.answers[field.code] as string) || '',
            value: formatDateForDisplay(this.answers[field.code] as string) || '',
            nestedFields: [],
          },
        ]
      default:
        return [
          {
            text: (this.answers[field.code] as string) || '',
            value: (this.answers[field.code] as string) || '',
            nestedFields: [],
          },
        ]
    }
  }

  /*
    Gets the raw value answer(s) for a given field code
   */
  getAnswers(field: string): string[] {
    const answers = this.answers[field]
    switch (typeof answers) {
      case 'string':
        return answers === '' ? undefined : [answers]
      case 'object':
        return answers.length === 0 ? undefined : answers
      default:
        return undefined
    }
  }

  protected getInitialStep() {
    return (
      Object.entries(this.options.steps).find(
        ([_, s]) => hasProperty(s, 'navigationOrder') && s.section === this.options.section,
      ) || []
    )
  }

  build(): Field[] {
    const [initialStepPath, initialStep] = this.getInitialStep()

    return this.getSteps(initialStep, initialStepPath).reduce(
      (fields: Field[], [stepPath, step]) =>
        Object.keys(step.fields)
          .map(fieldId => this.options.allFields[fieldId])
          .filter(this.stepFieldsFilterFn)
          .reduce(this.toStepFields(stepPath), fields),
      [],
    )
  }

  buildAndFlatten(): Field[] {
    const reducer = (acc: Field[], field: Field): Field[] => [
      ...acc,
      field,
      ...field.answers.flatMap(answer => answer.nestedFields.reduce(reducer, [])),
    ]
    return this.build().reduce(reducer, [])
  }
}
