import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { whereSelectable } from '../../app/common/controllers/saveAndContinue.utils'
import { removePractitionerAnalysisFields, removeSectionCompleteFields } from './nunjucks.utils'

interface SummaryField {
  field: FormWizard.Field
  backLink: string
  answers: SummaryFieldAnswer[]
}

interface SummaryFieldAnswer {
  text: string
  value: string
  nestedFields: SummaryField[]
}

interface Context {
  options: {
    allFields: { [key: string]: FormWizard.Field }
    section: string
    steps: FormWizard.Steps
  }
  answers: FormWizard.Answers
}

const hasProperty = (a: object, b: string): boolean => Object.prototype.hasOwnProperty.call(a, b)

function getAnswers(field: string, ctx: Context): string[] {
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

export default function getSummaryFields(ctx: Context): SummaryField[] {
  const summaryFields: SummaryField[] = []

  let [stepPath, step] = Object.entries(ctx.options.steps).find(
    ([_, s]) => hasProperty(s, 'navigationOrder') && s.section === ctx.options.section,
  )

  while (step !== undefined) {
    stepPath = stepPath.replace(/^\//, '')

    const fields = removeSectionCompleteFields(removePractitionerAnalysisFields(Object.keys(step.fields)))

    for (const code of fields) {
      if (getAnswers(code, ctx) === undefined) {
        continue
      }
      const field = ctx.options.allFields[code]
      if (field.dependent !== undefined) {
        addNestedSummaryField(field, summaryFields, ctx, stepPath)
        continue
      }
      summaryFields.push({
        field,
        backLink: `${stepPath}#${code}`,
        answers: getSummaryFieldAnswers(field, ctx),
      })
    }

    ;[stepPath, step] = getNextStep(step, ctx)
  }

  return summaryFields
}

function addNestedSummaryField(
  field: FormWizard.Field,
  summaryFields: SummaryField[],
  ctx: Context,
  stepPath: string,
): boolean {
  const parentField = field.dependent.field
  const parentFieldPos = summaryFields.findIndex(f => f.field.code === parentField)

  if (parentFieldPos > -1) {
    const answer = summaryFields[parentFieldPos].answers.find(it => it.value === field.dependent.value)
    if (answer !== undefined) {
      answer.nestedFields.push({
        field,
        backLink: `${stepPath}#${field.code}`,
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

function getSummaryFieldAnswers(field: FormWizard.Field, ctx: Context): SummaryFieldAnswer[] {
  switch (field.type) {
    case FieldType.Radio:
    case FieldType.Dropdown:
    case FieldType.CheckBox:
      return field.options
        .filter(o => whereSelectable(o) && getAnswers(field.code, ctx)?.includes(o.value))
        .map(o => {
          return {
            text: whereSelectable(o) ? o.text : '',
            value: whereSelectable(o) ? o.value : '',
            nestedFields: [],
          } as SummaryFieldAnswer
        })
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

function getNextStep(currentStep: FormWizard.Step, ctx: Context): [string?, FormWizard.Step?] {
  const nextStep = resolveNextStep(currentStep.next, ctx) as string

  if (nextStep === undefined) {
    return []
  }

  const nextStepPath = `/${nextStep.split('#')[0]}`

  return [nextStepPath, ctx.options.steps[nextStepPath]]
}

function resolveNextStep(next: FormWizard.Step.NextStep, ctx: Context): FormWizard.Step.NextStep {
  if (typeof next === 'string') {
    return next
  }

  if (hasProperty(next, 'field') && hasProperty(next, 'value')) {
    const con = next as FormWizard.Step.FieldValueCondition
    return getAnswers(con.field, ctx)?.includes(con.value) ? resolveNextStep(con.next, ctx) : undefined
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
