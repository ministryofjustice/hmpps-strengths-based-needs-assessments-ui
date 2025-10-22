import FormWizard from 'hmpo-form-wizard'
import sections, { Section } from '../form/v1_0/config/sections'
import StepResolver, { Options } from './fieldDependency/StepResolver'
import AnswersProvider from './fieldDependency/AnswersProvider'
import FieldMapper from './fieldDependency/FieldMapper'
import FieldsFactory from '../form/v1_0/fields/common/fieldsFactory'
import { validateField } from './validation'
import { dependencyMet } from './field.utils'

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

export class FieldDependencyTreeBuilder {
  private readonly options: Options

  private readonly answersProvider: AnswersProvider

  private readonly stepResolver: StepResolver

  private readonly fieldMapper: FieldMapper

  private readonly sections: Record<string, Section>

  constructor(options: Options, answers: FormWizard.Answers, sectionsConfig?: Record<string, Section>) {
    this.options = options
    this.sections = sectionsConfig ?? sections

    this.answersProvider = new AnswersProvider(answers)
    this.stepResolver = new StepResolver(options, this.answersProvider, this.sections)
    this.fieldMapper = new FieldMapper(options.allFields, this.answersProvider)
  }

  setStepFieldsFilterFn(filterFn: (field: FormWizard.Field) => boolean) {
    this.fieldMapper.setStepFieldsFilterFn(filterFn)
    return this
  }

  // Delegate public API while keeping original behaviour

  getAnswers(field: string, answersOverride: FormWizard.Answers = null) {
    return this.answersProvider.getAnswers(field, answersOverride)
  }

  getPageNavigation(): { url: string; stepsTaken: string[]; isSectionComplete: boolean } {
    const [initialStepPath, initialStep] = this.stepResolver.getInitialStepForSubsection()
    if (!initialStepPath || !initialStep) {
      return { url: '', stepsTaken: [], isSectionComplete: false }
    }

    let nextStep = initialStepPath
    const stepsTaken: string[] = []
    let isSectionComplete = true

    const steps = this.stepResolver.getSteps(initialStep, initialStepPath)

    for (const [stepUrl, step] of steps) {
      nextStep = stepUrl
      stepsTaken.push(stepUrl)

      // validate errors
      const hasErrors = Object.values(step.fields)
        .filter(it => dependencyMet(it, this.answersProvider.getRawAnswers())) // keep same dependency filtering as prior usage (dependencyMet moved into other modules if needed)
        .some(field => {
          const err = validateField(step.fields, field.id || field.code, this.answersProvider.getAnswers(field.code), {
            values: this.answersProvider.getRawAnswers(),
          })
          return err !== null
        })

      const userSubmittedField = FieldsFactory.getUserSubmittedField(Object.keys(step.fields))
      if (hasErrors || (userSubmittedField && this.answersProvider.getRawAnswers()[userSubmittedField] !== 'YES')) {
        isSectionComplete = false
        break
      }
    }

    if (steps.length < 2) {
      return { url: nextStep, stepsTaken, isSectionComplete }
    }

    // Determine last/penultimate step logic using sections config
    const { sectionCompleteField } =
      Object.values(this.sections).find(it => it.code === (this.options.section as keyof typeof sections)) || {}
    const [[lastStepUrl], [penultimateStepUrl]] = steps.reverse()

    return {
      url:
        nextStep === lastStepUrl && this.answersProvider.getRawAnswers()[sectionCompleteField] === 'NO'
          ? penultimateStepUrl
          : nextStep,
      stepsTaken,
      isSectionComplete,
    }
  }

  getInitialStepsForSubsections(): [string, FormWizard.RenderedStep][] {
    return this.stepResolver.getInitialStepsForSubsections()
  }

  getAllFieldsInSectionFromSteps(): Field[] {
    const initialStepsForSubsections = this.getInitialStepsForSubsections()
    if (initialStepsForSubsections.length === 0) return []

    const allSteps = initialStepsForSubsections.flatMap(([stepPath, step]) =>
      this.stepResolver.getSteps(step, `/${stepPath}`),
    )
    return allSteps.reduce(
      (fields: Field[], [currentStepPath, currentStep]) =>
        Object.keys(currentStep.fields)
          .map(fieldId => this.options.allFields[fieldId])
          .filter(this.fieldMapper.getStepFieldsFilterFn())
          .reduce(this.fieldMapper.toStepFields(`${currentStepPath}`), fields),
      [],
    )
  }

  getAllNestedFieldsInSectionFromSteps(): Field[] {
    const reducer = (acc: Field[], field: Field): Field[] => [
      ...acc,
      field,
      ...field.answers.flatMap(answer => answer.nestedFields.reduce(reducer, [])),
    ]
    return this.getAllFieldsInSectionFromSteps().reduce(reducer, [])
  }
}
