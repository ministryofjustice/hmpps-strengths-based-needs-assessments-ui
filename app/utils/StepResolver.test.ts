import FormWizard from 'hmpo-form-wizard'
import StepResolver, { Options } from './StepResolver'
import AnswersProvider from './AnswersProvider'

class TestableStepResolver extends StepResolver {
  public resolveNextStepPublic(next: FormWizard.Step.NextStep): FormWizard.Step.NextStep {
    return this.resolveNextStep(next)
  }

  public getStepsPublic(step: FormWizard.RenderedStep, path: string, acc: [string, FormWizard.RenderedStep][] = []) {
    return this.getSteps(step, path, acc)
  }

  public getInitialStepForSubsectionPublic() {
    return this.getInitialStepForSubsection()
  }
}

describe('app/utils/StepResolver', () => {
  const mockSections = {
    testSection: {
      title: 'Test Section',
      code: 'testSection',
      navigationOrder: 1,
      subsections: {
        subSectionA: {
          title: 'Test Subsection',
          code: 'test-sub',
          navigationOrder: 1,
          stepUrls: {
            step1: 'step-1',
            step2: 'step-2',
          },
        },
      },
    },
  }

  const stepResolverWithAnswers = (
    answers: FormWizard.Answers,
    options: Options = { section: 'test', allFields: {}, steps: {} },
  ) => new TestableStepResolver(options, new AnswersProvider(answers), mockSections)

  const builderWithStep = (stepPath: string, step: FormWizard.RenderedStep): TestableStepResolver =>
    new TestableStepResolver(
      {
        section: step.section,
        route: step.route,
        allFields: {},
        steps: {
          [stepPath]: step,
        },
      },
      new AnswersProvider({}),
      mockSections,
    )

  describe('resolveNextStep', () => {
    const sut = stepResolverWithAnswers({ test: 'val' })

    it('should return a string when the next step is a string', () => {
      expect(sut.resolveNextStepPublic('testStep')).toEqual('testStep')
    })

    describe('next step is a FieldValueCondition', () => {
      it('should return undefined for a non-existent field', () => {
        const next = { field: 'foo', value: 'bar', next: 'testNext' }
        expect(sut.resolveNextStepPublic(next)).toBeUndefined()
      })

      it('should return undefined when field value does not match', () => {
        const next = { field: 'test', value: 'foo', next: 'testNext' }
        expect(sut.resolveNextStepPublic(next)).toBeUndefined()
      })

      it('should return the next step when field value matches', () => {
        const next = { field: 'test', value: 'val', next: 'testNext' }
        expect(sut.resolveNextStepPublic(next)).toEqual('testNext')
      })

      it('should resolve next step recursively when field value matches', () => {
        const next = {
          field: 'test',
          value: 'val',
          next: {
            field: 'test',
            value: 'val',
            next: {
              field: 'test',
              value: 'val',
              next: 'finalNext',
            },
          },
        }
        expect(sut.resolveNextStepPublic(next)).toEqual('finalNext')
      })

      it('should resolve next step recursively and return undefined if the final condition does not match', () => {
        const next = {
          field: 'test',
          value: 'val',
          next: {
            field: 'test',
            value: 'val',
            next: {
              field: 'test',
              value: 'foo',
              next: 'finalNext',
            },
          },
        }
        expect(sut.resolveNextStepPublic(next)).toBeUndefined()
      })
    })

    describe('next step is a CallbackCondition', () => {
      it('should return undefined', () => {
        const next = { fn: () => true, next: 'testStep' }
        expect(sut.resolveNextStepPublic(next)).toBeUndefined()
      })

      it('should skip the callback condition', () => {
        const next = [{ fn: () => true, next: 'testStep' }, 'defaultStep']
        expect(sut.resolveNextStepPublic(next)).toEqual('defaultStep')
      })
    })

    describe('next step is a collection of next steps', () => {
      it('should return undefined when next steps is empty', () => {
        const next: FormWizard.Step.NextStep = []
        expect(sut.resolveNextStepPublic(next)).toBeUndefined()
      })

      it('should return undefined when none of the next steps matches', () => {
        const next: FormWizard.Step.NextStep = [
          { field: 'test', value: 'foo', next: 'testNext1' },
          { field: 'test', value: 'bar', next: 'testNext2' },
          { field: 'test', value: 'baz', next: 'testNext3' },
        ]
        expect(sut.resolveNextStepPublic(next)).toBeUndefined()
      })

      it('should return the first matching step', () => {
        const next: FormWizard.Step.NextStep = [
          { field: 'test', value: 'foo', next: 'testNext1' },
          { field: 'test', value: 'val', next: 'testNext2' },
          { field: 'test', value: 'val', next: 'testNext3' },
        ]
        expect(sut.resolveNextStepPublic(next)).toEqual('testNext2')
      })

      it('should process nested steps recursively and return the first matching step', () => {
        const next: FormWizard.Step.NextStep = [
          { field: 'test', value: 'foo', next: 'testNext1' },
          {
            field: 'test',
            value: 'val',
            next: {
              field: 'test',
              value: 'val',
              next: {
                field: 'test',
                value: 'val',
                next: 'finalNext',
              },
            },
          },
          { field: 'test', value: 'val', next: 'testNext3' },
        ]
        expect(sut.resolveNextStepPublic(next)).toEqual('finalNext')
      })
    })
  })

  describe('getSteps', () => {
    const currentStep: FormWizard.RenderedStep = { pageTitle: 'page 1', section: 'none' }
    const nextStep: FormWizard.RenderedStep = { pageTitle: 'page 2', section: 'none' }
    const sut = builderWithStep('/page-2', nextStep)

    it('should return the path and step object of the next steps', () => {
      currentStep.next = 'page-2'
      expect(sut.getStepsPublic(currentStep, '/page-1', [])).toEqual([
        ['page-1', currentStep],
        ['page-2', nextStep],
      ])
    })

    it('should strip anchor tags from the path of the next step', () => {
      currentStep.next = 'page-2#question'
      expect(sut.getStepsPublic(currentStep, '/page-1', [])).toEqual([
        ['page-1', currentStep],
        ['page-2', nextStep],
      ])
    })

    it('should return only the current step when no next step is resolved', () => {
      currentStep.next = []
      expect(sut.getStepsPublic(currentStep, '/page-1', [])).toEqual([['page-1', currentStep]])
    })

    it('should return an empty array when the current step is undefined', () => {
      expect(sut.getStepsPublic(undefined, '/page-1', [])).toEqual([])
    })
  })

  describe('getInitialStepForSubsection', () => {
    it('should return an empty array when section is not found', () => {
      const options: FormWizard.FormOptions = {
        section: 'notTestSection',
        route: '/does-not-matter',
        steps: {},
        allFields: {},
      } as unknown as FormWizard.FormOptions

      const sut = new TestableStepResolver(options, null, mockSections)
      expect(sut.getInitialStepForSubsectionPublic()).toEqual([])
    })

    it('should return an empty array when subsection is not found', () => {
      const options: FormWizard.FormOptions = {
        section: 'testSection',
        route: '/non-existent-route',
        steps: {},
        allFields: {},
      } as unknown as FormWizard.FormOptions

      const sut = new TestableStepResolver(options, null, mockSections)
      expect(sut.getInitialStepForSubsectionPublic()).toEqual([])
    })

    it('should return an empty array when no valid initial step exists in the subsection', () => {
      const options: FormWizard.FormOptions = {
        section: 'testSection',
        route: '/step-1',
        steps: {
          '/step-1': { route: '/step-1', initialStepInSection: false },
          '/step-2': { route: '/step-2', initialStepInSection: false },
        },
        allFields: {},
      } as unknown as FormWizard.FormOptions

      const sut = new TestableStepResolver(options, null, mockSections)
      expect(sut.getInitialStepForSubsectionPublic()).toEqual([])
    })

    it('should return the correct initial step for a valid subsection', () => {
      const options: FormWizard.FormOptions = {
        section: 'testSection',
        route: '/step-1',
        steps: {
          '/step-2': { route: '/step-2', initialStepInSection: false },
          '/step-1': { route: '/step-1', initialStepInSection: true },
        },
        allFields: {},
      } as unknown as FormWizard.FormOptions

      const sut = new TestableStepResolver(options, null, mockSections)
      expect(sut.getInitialStepForSubsectionPublic()).toEqual(['/step-1', options.steps['/step-1']])
    })
  })
})
