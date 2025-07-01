import FormWizard from 'hmpo-form-wizard'
import { FieldType } from '../../server/@types/hmpo-form-wizard/enums'
import { dependencyMet, isPractitionerAnalysisField, whereSelectable } from './field.utils'
import FieldsFactory from '../form/v1_0/fields/common/fieldsFactory'
import sections from '../form/v1_0/config/sections'
import { validateField } from './validation'
import { formatDateForDisplay } from './formatters'

export interface Options {
  section: string
  allFields: Record<string, FormWizard.Field>
  steps: FormWizard.RenderedSteps
}

export interface Field {
  field: FormWizard.Field
  changeLink: string
  answers: FieldAnswer[]
}

export interface FieldAnswer {
  text: string
  html?: string
  value: string
  nestedFields: Field[]
}

type StepFieldsFilterFn = (field: FormWizard.Field) => boolean
const hasProperty = (a: object, b: string) => Object.prototype.hasOwnProperty.call(a, b)

export class FieldDependencyTreeBuilder {
  private readonly options: Options

  private readonly answers: FormWizard.Answers

  private answersOverride: FormWizard.Answers = null

  private stepFieldsFilterFn: StepFieldsFilterFn = () => true

  constructor(options: Options, answers: FormWizard.Answers) {
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
    Resolves the next step given a `next` FormWizard step criteria.
    Explicitly doesn't support CallbackCondition.
   */
  protected resolveNextStep(next: FormWizard.Step.NextStep): FormWizard.Step.NextStep {
    if (next === undefined || typeof next === 'string') {
      return next
    }

    if (hasProperty(next, 'field') && hasProperty(next, 'value')) {
      const con = next as FormWizard.Step.FieldValueCondition
      const conditionMet = (condition: string | string[]) => (value: string | string[]) => {
        const cond = Array.isArray(condition) ? condition : [condition]
        const val = Array.isArray(value) ? value : [value]
        return val.some(valToCheck => cond.includes(valToCheck))
      }
      return this.getAnswers(con.field)?.some(conditionMet(con.value)) ? this.resolveNextStep(con.next) : undefined
    }

    if (hasProperty(next, 'fn')) {
      return undefined
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
        const entries = ((this.answers[field.code] || []) as FormWizard.CollectionEntry[]).map((entry, index) => {
          this.answersOverride = entry

          const entryFields = field.collection.fields
            .map(it => this.options.allFields[it.code])
            .reduce(this.toStepFields(`${field.collection.updateUrl}/${index}`), [])

          delete this.answersOverride

          return {
            text: field.text,
            value: '',
            nestedFields: entryFields,
          } as FieldAnswer
        })

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
    const answers = this.answersOverride || this.answers

    switch (field.type) {
      case FieldType.Radio:
      case FieldType.Dropdown:
      case FieldType.CheckBox:
      case FieldType.AutoComplete:
        return field.options
          .filter(o => whereSelectable(o) && this.getAnswers(field.code, answers)?.includes(o.value))
          .map(o => {
            return {
              text: whereSelectable(o) ? o.summary?.displayFn(o.text, o.value) || o.text : '',
              html: whereSelectable(o) ? o.html : null,
              value: whereSelectable(o) ? o.value : '',
              nestedFields: [],
            } as FieldAnswer
          })
      case FieldType.Date:
        return [
          {
            text: field.summary?.displayFn
              ? field.summary?.displayFn(answers[field.code] as string)
              : formatDateForDisplay(answers[field.code] as string) || '',
            value: formatDateForDisplay(answers[field.code] as string) || '',
            nestedFields: [],
          },
        ]
      default:
        return [
          {
            text: (answers[field.code] as string) || '',
            value: (answers[field.code] as string) || '',
            nestedFields: [],
          },
        ]
    }
  }

  /*
    Gets the raw value answer(s) for a given field code
   */
  getAnswers(field: string, answersOverride: FormWizard.Answers = null): string[] | null {
    const answers = answersOverride || this.answers
    const fieldAnswer = answers[field]

    if (typeof fieldAnswer === 'string') {
      return fieldAnswer === '' ? null : [fieldAnswer]
    }

    if (!Array.isArray(fieldAnswer) || fieldAnswer.length === 0) {
      return null
    }

    return typeof fieldAnswer[0] === 'string' ? (fieldAnswer as string[]) : null
  }

  /**
   * Retrieves the initial step for the current section.
   *
   * This method searches through the steps defined in the `options.steps` object
   * and finds the first step that has a `navigationOrder` property and belongs
   * to the section specified in `options.section`.
   *
   * @returns {[string, FormWizard.RenderedStep] | []} - A tuple containing the path
   * and the step object if a matching step is found, or an empty array if no match is found.
   */
  protected getInitialStep() {
    return (
      Object.entries(this.options.steps).find(
        ([_, step]) => step.navigationOrder && step.section === this.options.section,
      ) || []
    )
  }

  /**
   * This method calculates the next step URL, the steps taken so far, and whether
   * the section is complete based on the user's answers and validation results.
   *
   * @returns {{ url: string; stepsTaken: string[]; isSectionComplete: boolean }} -
   * An object containing:
   * - `url`: The URL of the next step to navigate to.
   * - `stepsTaken`: An array of step URLs that have been traversed.
   * - `isSectionComplete`: A boolean indicating whether the section is complete.
   */
  getPageNavigation(overrideNextStep?: boolean, overrideNextStepUrl?: string): { url: string; stepsTaken: string[]; isSectionComplete: boolean } {
    const [initialStepPath, initialStep] = this.getInitialStep()

    let nextStep = initialStepPath
    const stepsTaken = []

    let isSectionComplete = true

    const steps = this.getSteps(initialStep, initialStepPath)

    for (const [stepUrl, step] of steps) {
      nextStep = stepUrl
      stepsTaken.push(stepUrl)

      const hasErrors = Object.values(step.fields)
        .filter(it => dependencyMet(it, this.answers))
        .some(field => {
          const err = validateField(step.fields, field.id || field.code, this.answers[field.code], {
            values: this.answers,
          })
          return err !== null
        })
      // TODO I think this is a simplified version of what happens in getAssessmentProgress in saveAndContinueController.ts
      // Because of this, it gives a different answer to the sectionProgress set in saveAndContinueController.getValues()
      // A whole bunch of code like that needs splitting out in Section and Step service classes I think.
      const userSubmittedField = FieldsFactory.getUserSubmittedField(Object.keys(step.fields))
      if (hasErrors || (userSubmittedField && this.answers[userSubmittedField] !== 'YES')) {
        isSectionComplete = false
        break
      }

      // if (stepUrl === 'accommodation-analysis') {
      //   break
      // }
    }

    if (steps.length < 2) {
      return {
        url: nextStep,
        stepsTaken,
        isSectionComplete,
      }
    }

    const { sectionCompleteField } = Object.values(sections).find(it => it.code === this.options.section) || {}
    const [[lastStepUrl], [penultimateStepUrl]] = steps.reverse()

    const shouldGoToPenultimate = nextStep === lastStepUrl && this.answers[sectionCompleteField] === 'NO'
    const url = shouldGoToPenultimate ? penultimateStepUrl : nextStep

    // const url = nextStep

    return {
      url,
      stepsTaken,
      isSectionComplete,
    }
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
