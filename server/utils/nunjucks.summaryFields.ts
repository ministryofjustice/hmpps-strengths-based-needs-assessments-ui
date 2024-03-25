import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { whereSelectable } from '../../app/common/controllers/saveAndContinue.utils'
import { formatDateForDisplay, removePractitionerAnalysisFields, removeSectionCompleteFields } from './nunjucks.utils'

export interface SummaryField {
  field: FormWizard.Field
  backLink: string
  answers: SummaryFieldAnswer[]
}

export interface SummaryFieldAnswer {
  text: string
  value: string
  nestedFields: SummaryField[]
}

export interface Context {
  options: {
    section: string
    steps: FormWizard.RenderedSteps
    allFields: FormWizard.Fields
  }
  answers: FormWizard.Answers
}

export const hasProperty = (a: object, b: string): boolean => Object.prototype.hasOwnProperty.call(a, b)

export function getAnswers(field: string, ctx: Context): string[] {
  const answers = ctx.answers[field]
  switch (typeof answers) {
    case 'string':
      return answers === '' ? undefined : [answers]
    case 'object':
      return answers.length === 0 ? undefined : answers
    default:
      return undefined
  }
}

const isDisplayable = (ctx: Context, field: FormWizard.Field) =>
  field && (getAnswers(field.code, ctx) !== undefined || field.summary?.displayAlways)

export default function getSummaryFields(ctx: Context): SummaryField[] {
  const summaryFields: SummaryField[] = []

  let [stepPath, step] =
    Object.entries(ctx.options.steps).find(
      ([_, s]) => hasProperty(s, 'navigationOrder') && s.section === ctx.options.section,
    ) || []

  while (step !== undefined && step.section === ctx.options.section) {
    stepPath = stepPath.replace(/^\//, '')

    const fieldIds = removeSectionCompleteFields(removePractitionerAnalysisFields(Object.keys(step.fields)))

    for (const fieldId of fieldIds) {
      const field = ctx.options.allFields[fieldId]
      if (!isDisplayable(ctx, field)) {
        continue
      }
      if (field.dependent !== undefined) {
        addNestedSummaryField(field, summaryFields, ctx, stepPath)
        continue
      }
      summaryFields.push({
        field,
        backLink: `${stepPath}#${fieldId}`,
        answers: getSummaryFieldAnswers(field, ctx),
      })
    }

    ;[stepPath, step] = getNextStep(step, ctx)
  }

  return summaryFields
}

export function addNestedSummaryField(
  field: FormWizard.Field,
  summaryFields: SummaryField[],
  ctx: Context,
  stepPath: string,
): boolean {
  const parentField = field.dependent.field
  const parentFieldPos = summaryFields.findIndex(f => (f.field.id || f.field.code) === parentField)

  if (parentFieldPos > -1) {
    const answer = summaryFields[parentFieldPos].answers.find(it => it.value === field.dependent.value)
    if (answer !== undefined) {
      const fieldId = field.id || field.code
      answer.nestedFields.push({
        field,
        backLink: `${stepPath}#${fieldId}`,
        answers: getSummaryFieldAnswers(field, ctx),
      })
      return true
    }
  }
  for (const summaryField of summaryFields) {
    for (const answer of summaryField.answers) {
      if (addNestedSummaryField(field, answer.nestedFields, ctx, stepPath)) return true
    }
  }
  return false
}

export function getSummaryFieldAnswers(field: FormWizard.Field, ctx: Context): SummaryFieldAnswer[] {
  switch (field.type) {
    case FieldType.Radio:
    case FieldType.Dropdown:
    case FieldType.CheckBox:
      return field.options
        .filter(o => whereSelectable(o) && getAnswers(field.code, ctx)?.includes(o.value))
        .map(o => {
          return {
            text: whereSelectable(o) ? o.summary?.displayFn(o.text, o.value) || o.text : '',
            value: whereSelectable(o) ? o.value : '',
            nestedFields: [],
          } as SummaryFieldAnswer
        })
    case FieldType.Date:
      return [
        {
          text: field.summary?.displayFn
            ? field.summary?.displayFn(ctx.answers[field.code] as string)
            : formatDateForDisplay(ctx.answers[field.code] as string) || '',
          value: formatDateForDisplay(ctx.answers[field.code] as string) || '',
          nestedFields: [],
        },
      ]
    default:
      return [
        {
          text: (ctx.answers[field.code] as string) || '',
          value: (ctx.answers[field.code] as string) || '',
          nestedFields: [],
        },
      ]
  }
}

export function getNextStep(currentStep: FormWizard.RenderedStep, ctx: Context): [string?, FormWizard.RenderedStep?] {
  const nextStep = resolveNextStep(currentStep.next, ctx) as string

  if (nextStep === undefined) {
    return []
  }

  const nextStepPath = `/${nextStep.split('#')[0]}`

  return [nextStepPath, ctx.options.steps[nextStepPath]]
}

export function resolveNextStep(next: FormWizard.Step.NextStep, ctx: Context): FormWizard.Step.NextStep {
  if (next === undefined) {
    return next
  }

  if (typeof next === 'string') {
    return next
  }

  if (hasProperty(next, 'field') && hasProperty(next, 'value')) {
    const con = next as FormWizard.Step.FieldValueCondition
    const conditionMet = (condition: string | string[]) => (value: string) =>
      Array.isArray(condition) ? condition.includes(value) : condition === value
    return getAnswers(con.field, ctx)?.some(conditionMet(con.value)) ? resolveNextStep(con.next, ctx) : undefined
  }

  if (hasProperty(next, 'fn')) {
    const con = next as FormWizard.Step.CallbackCondition
    throw new Error(`unable to resolve ${con.next} - callbacks are not supported yet`)
  }

  for (const nestedNext of next as FormWizard.Step.NextStep[]) {
    const check = resolveNextStep(nestedNext, ctx)
    if (check !== undefined) {
      return check
    }
  }

  return undefined
}
