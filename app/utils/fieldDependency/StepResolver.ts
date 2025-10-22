import FormWizard from 'hmpo-form-wizard'
import { Section } from '../../form/v1_0/config/sections'
import AnswersProvider from './AnswersProvider'

export interface Options {
  section: string
  route?: string
  allFields: Record<string, FormWizard.Field>
  steps: FormWizard.RenderedSteps
}

export default class StepResolver {
  private readonly options: Options

  private readonly answersProvider: AnswersProvider

  private readonly sections: Record<string, Section>

  constructor(options: Options, answersProvider: AnswersProvider, sections: Record<string, Section>) {
    this.options = options
    this.answersProvider = answersProvider
    this.sections = sections
  }

  protected resolveNextStep(next: FormWizard.Step.NextStep): FormWizard.Step.NextStep {
    if (next === undefined) return undefined

    if (typeof next === 'string') return next

    if (Object.prototype.hasOwnProperty.call(next, 'field') && Object.prototype.hasOwnProperty.call(next, 'value')) {
      const con = next as FormWizard.Step.FieldValueCondition
      const conditionMet = (condition: string | string[]) => (value: string | string[]) => {
        const cond = Array.isArray(condition) ? condition : [condition]
        const val = Array.isArray(value) ? value : [value]
        return val.some(valToCheck => cond.includes(valToCheck))
      }
      return this.answersProvider.getAnswers(con.field)?.some(conditionMet(con.value))
        ? this.resolveNextStep(con.next)
        : undefined
    }

    if (Object.prototype.hasOwnProperty.call(next, 'fn')) {
      return undefined
    }

    if (Array.isArray(next)) {
      return next.reduce((result, it) => result || this.resolveNextStep(it), undefined)
    }

    return undefined
  }

  getSteps(
    step: FormWizard.RenderedStep,
    path: string,
    acc: [string, FormWizard.RenderedStep][] = [],
  ): [string, FormWizard.RenderedStep][] {
    if (step === undefined || step.section !== this.options.section) return acc
    acc.push([path.replace(/^\/+/, ''), step])
    const nextStep = this.resolveNextStep(step.next) as string
    if (nextStep === undefined) return acc
    const nextStepPath = `/${nextStep.split('#')[0]}`
    return this.getSteps(this.options.steps[nextStepPath], nextStepPath, acc)
  }

  protected findSubsectionByRoute(section: Section, route: string): Section | undefined {
    if (!section?.subsections) return undefined
    const normalizedRoute = route?.substring(1)
    return (
      Object.entries(section.subsections).find(([, subsection]) => {
        const stepUrls = subsection.stepUrls || {}
        return Object.values(stepUrls).includes(normalizedRoute)
      })?.[1] || null
    )
  }

  protected isInitialStepInSubsection(step: FormWizard.RenderedStep, validUrls: string[]): boolean {
    if (!step?.initialStepInSection || !step?.route) return false
    const normalizedStepRoute = step.route.substring(1)
    return validUrls.includes(normalizedStepRoute)
  }

  protected getInitialStep() {
    return (
      Object.entries(this.options.steps).find(
        ([_, s]) => Object.prototype.hasOwnProperty.call(s, 'navigationOrder') && s.section === this.options.section,
      ) || []
    )
  }

  getInitialStepForSubsection() {
    const section = Object.values(this.sections).find(s => s.code === this.options.section)
    const sectionHasSubsections = section && 'subsections' in section
    if (!sectionHasSubsections) return this.getInitialStep()

    const foundSubsection = this.findSubsectionByRoute(section, this.options.route)
    const subsectionStepUrls = Object.values(foundSubsection?.stepUrls || {})
    const initialStep = Object.entries(this.options.steps).find(([_, step]) =>
      this.isInitialStepInSubsection(step, subsectionStepUrls),
    )
    return initialStep || []
  }

  getInitialStepsForSubsections(): [string, FormWizard.RenderedStep][] {
    const section = Object.values(this.sections).find(s => s.code === this.options.section)
    if (!section?.subsections) {
      return [
        Object.entries(this.options.steps).find(
          ([_, s]) => Object.prototype.hasOwnProperty.call(s, 'navigationOrder') && s.section === this.options.section,
        ),
      ].filter(Boolean)
    }

    return Object.entries(this.options.steps)
      .filter(([_, step]) => step.section === this.options.section && step.initialStepInSection === true)
      .map(([path, step]) => [path.substring(1), step])
  }
}
