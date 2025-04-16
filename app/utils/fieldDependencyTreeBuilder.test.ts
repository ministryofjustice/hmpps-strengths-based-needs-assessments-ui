import FormWizard from 'hmpo-form-wizard'
import { FieldType, ValidationType } from '../../server/@types/hmpo-form-wizard/enums'
import { Field, FieldAnswer, FieldDependencyTreeBuilder } from './fieldDependencyTreeBuilder'

class TestableFieldDependencyTreeBuilder extends FieldDependencyTreeBuilder {
  getSteps(
    step: FormWizard.RenderedStep,
    path: string,
    acc: [string, FormWizard.RenderedStep][] = [],
  ): [string, FormWizard.RenderedStep][] {
    return super.getSteps(step, path, acc)
  }

  resolveNextStep(next: FormWizard.Step.NextStep): FormWizard.Step.NextStep {
    return super.resolveNextStep(next)
  }

  toStepFields(stepPath: string): (fields: Field[], field: FormWizard.Field) => Field[] {
    return super.toStepFields(stepPath)
  }

  addNestedField(fieldToNest: FormWizard.Field, fieldsAtCurrentDepth: Field[], stepPath: string): boolean {
    return super.addNestedField(fieldToNest, fieldsAtCurrentDepth, stepPath)
  }

  getFieldAnswers(field: FormWizard.Field): FieldAnswer[] {
    return super.getFieldAnswers(field)
  }

  getInitialStep() {
    return super.getInitialStep()
  }
}

describe('app/utils/fieldDependencyTreeBuilder', () => {
  const builderWithAnswer = (field: string, value: string | string[]): TestableFieldDependencyTreeBuilder =>
    new TestableFieldDependencyTreeBuilder({} as FormWizard.FormOptions, {
      [field]: value,
    })

  const builderWithStep = (stepPath: string, step: FormWizard.RenderedStep): TestableFieldDependencyTreeBuilder =>
    new TestableFieldDependencyTreeBuilder(
      {
        section: step.section,
        steps: {
          [stepPath]: step,
        },
      } as FormWizard.FormOptions,
      {},
    )

  describe('getAnswers', () => {
    it('should return a string value as array', () => {
      const sut = builderWithAnswer('test', 'val')
      expect(sut.getAnswers('test')).toEqual(['val'])
    })

    it('should return an array value as array', () => {
      const sut = builderWithAnswer('test', ['val'])
      expect(sut.getAnswers('test')).toEqual(['val'])
    })

    it('should return null when the field does not exist', () => {
      const sut = builderWithAnswer('test', 'val')
      expect(sut.getAnswers('foo')).toBeNull()
    })

    it('should return null when the value is undefined', () => {
      const sut = builderWithAnswer('test', undefined)
      expect(sut.getAnswers('foo')).toBeNull()
    })

    it('should return null when value is an empty array', () => {
      const sut = builderWithAnswer('test', [])
      expect(sut.getAnswers('test')).toBeNull()
    })

    it('should return null when value is an empty string', () => {
      const sut = builderWithAnswer('test', '')
      expect(sut.getAnswers('test')).toBeNull()
    })
  })

  describe('resolveNextStep', () => {
    const sut = builderWithAnswer('test', 'val')

    it('should return a string when the next step is a string', () => {
      expect(sut.resolveNextStep('testStep')).toEqual('testStep')
    })

    describe('next step is a FieldValueCondition', () => {
      it('should return undefined for a non-existent field', () => {
        const next = { field: 'foo', value: 'bar', next: 'testNext' }
        expect(sut.resolveNextStep(next)).toBeUndefined()
      })

      it('should return undefined when field value does not match', () => {
        const next = { field: 'test', value: 'foo', next: 'testNext' }
        expect(sut.resolveNextStep(next)).toBeUndefined()
      })

      it('should return the next step when field value matches', () => {
        const next = { field: 'test', value: 'val', next: 'testNext' }
        expect(sut.resolveNextStep(next)).toEqual('testNext')
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
        expect(sut.resolveNextStep(next)).toEqual('finalNext')
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
        expect(sut.resolveNextStep(next)).toBeUndefined()
      })
    })

    describe('next step is a CallbackCondition', () => {
      it('should return undefined', () => {
        const next = { fn: () => true, next: 'testStep' }
        expect(sut.resolveNextStep(next)).toBeUndefined()
      })

      it('should skip the callback condition', () => {
        const next = [{ fn: () => true, next: 'testStep' }, 'defaultStep']
        expect(sut.resolveNextStep(next)).toEqual('defaultStep')
      })
    })

    describe('next step is a collection of next steps', () => {
      it('should return undefined when next steps is empty', () => {
        const next: FormWizard.Step.NextStep = []
        expect(sut.resolveNextStep(next)).toBeUndefined()
      })

      it('should return undefined when none of the next steps matches', () => {
        const next: FormWizard.Step.NextStep = [
          { field: 'test', value: 'foo', next: 'testNext1' },
          { field: 'test', value: 'bar', next: 'testNext2' },
          { field: 'test', value: 'baz', next: 'testNext3' },
        ]
        expect(sut.resolveNextStep(next)).toBeUndefined()
      })

      it('should return the first matching step', () => {
        const next: FormWizard.Step.NextStep = [
          { field: 'test', value: 'foo', next: 'testNext1' },
          { field: 'test', value: 'val', next: 'testNext2' },
          { field: 'test', value: 'val', next: 'testNext3' },
        ]
        expect(sut.resolveNextStep(next)).toEqual('testNext2')
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
        expect(sut.resolveNextStep(next)).toEqual('finalNext')
      })
    })
  })

  describe('getSteps', () => {
    const currentStep: FormWizard.RenderedStep = { pageTitle: 'page 1', section: 'none', group: 'Test group' }
    const nextStep: FormWizard.RenderedStep = { pageTitle: 'page 2', section: 'none', group: 'Test group' }
    const sut = builderWithStep('/page-2', nextStep)

    it('should return the path and step object of the next steps', () => {
      currentStep.next = 'page-2'
      expect(sut.getSteps(currentStep, '/page-1', [])).toEqual([
        ['page-1', currentStep],
        ['page-2', nextStep],
      ])
    })

    it('should strip anchor tags from the path of the next step', () => {
      currentStep.next = 'page-2#question'
      expect(sut.getSteps(currentStep, '/page-1', [])).toEqual([
        ['page-1', currentStep],
        ['page-2', nextStep],
      ])
    })

    it('should return only the current step when no next step is resolved', () => {
      currentStep.next = []
      expect(sut.getSteps(currentStep, '/page-1', [])).toEqual([['page-1', currentStep]])
    })

    it('should return an empty array when the current step is undefined', () => {
      expect(sut.getSteps(undefined, '/page-1', [])).toEqual([])
    })
  })

  describe('getFieldAnswers', () => {
    const optionsField: FormWizard.Field = {
      id: 'q1',
      text: 'Q1',
      code: 'q1',
      type: undefined,
      options: [
        { text: 'Value 1', value: 'val1', kind: 'option' },
        { text: 'Value 2', value: 'val2', kind: 'option' },
      ],
    }
    const textField: FormWizard.Field = { id: 'q2', text: 'Q2', code: 'q2', type: undefined }

    it('should return radio button answer', () => {
      optionsField.type = FieldType.Radio
      const sut = builderWithAnswer('q1', 'val1')
      const expected: FieldAnswer[] = [{ text: 'Value 1', value: 'val1', nestedFields: [] }]
      expect(sut.getFieldAnswers(optionsField)).toEqual(expected)
    })

    it('should return dropdown answer', () => {
      optionsField.type = FieldType.Dropdown
      const sut = builderWithAnswer('q1', 'val2')
      const expected: FieldAnswer[] = [{ text: 'Value 2', value: 'val2', nestedFields: [] }]
      expect(sut.getFieldAnswers(optionsField)).toEqual(expected)
    })

    it('should return checkbox answers', () => {
      optionsField.type = FieldType.CheckBox
      const sut = builderWithAnswer('q1', ['val1', 'val2'])
      const expected: FieldAnswer[] = [
        { text: 'Value 1', value: 'val1', nestedFields: [] },
        { text: 'Value 2', value: 'val2', nestedFields: [] },
      ]
      expect(sut.getFieldAnswers(optionsField)).toEqual(expected)
    })

    it('should return textarea answer', () => {
      textField.type = FieldType.TextArea
      const sut = builderWithAnswer('q2', 'free text')
      const expected: FieldAnswer[] = [{ text: 'free text', value: 'free text', nestedFields: [] }]
      expect(sut.getFieldAnswers(textField)).toEqual(expected)
    })

    it('should return text field answer', () => {
      textField.type = FieldType.Text
      const sut = builderWithAnswer('q2', 'free text')
      const expected: FieldAnswer[] = [{ text: 'free text', value: 'free text', nestedFields: [] }]
      expect(sut.getFieldAnswers(textField)).toEqual(expected)
    })

    it('should return date field answer', () => {
      textField.type = FieldType.Date
      const sut = builderWithAnswer('q2', '1970-01-01')
      const expected: FieldAnswer[] = [{ text: '01 January 1970', value: '01 January 1970', nestedFields: [] }]
      expect(sut.getFieldAnswers(textField)).toEqual(expected)
    })

    it('should return an empty array when no answer exists', () => {
      optionsField.type = FieldType.Radio
      const sut = builderWithAnswer('q2', 'free text')
      expect(sut.getFieldAnswers(optionsField)).toEqual([])
    })
  })

  describe('addNestedField', () => {
    it('should find the parent field recursively and nest the field into the parent field answer', () => {
      const fieldsTree: Field[] = [
        {
          field: { id: 'q0', text: 'Q0', code: 'q0', type: FieldType.Text },
          changeLink: '/back',
          answers: [
            {
              text: 'val0',
              value: 'val0',
              nestedFields: [],
            },
          ],
        },
        {
          field: { id: 'q1', text: 'Q1', code: 'q1', type: FieldType.Text },
          changeLink: '/back',
          answers: [
            {
              text: 'val1',
              value: 'val1',
              nestedFields: [
                {
                  field: { id: 'q2', text: 'Q2', code: 'q2', type: FieldType.Text },
                  changeLink: '/back',
                  answers: [
                    {
                      text: 'val2',
                      value: 'val2',
                      nestedFields: [
                        {
                          field: { id: 'q3', text: 'Q3', code: 'q3', type: FieldType.Text },
                          changeLink: '/back',
                          answers: [
                            {
                              text: 'val3',
                              value: 'val3',
                              nestedFields: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
      const field: FormWizard.Field = {
        id: 'q4_id',
        text: 'Q4',
        code: 'q4',
        type: FieldType.Text,
        dependent: { field: 'q3', value: 'val3' },
      }
      const sut = builderWithAnswer('q4', 'val4')

      expect(sut.addNestedField(field, fieldsTree, '/test-page')).toEqual(true)
      expect(fieldsTree).toEqual([
        {
          field: { id: 'q0', text: 'Q0', code: 'q0', type: FieldType.Text },
          changeLink: '/back',
          answers: [
            {
              text: 'val0',
              value: 'val0',
              nestedFields: [],
            },
          ],
        },
        {
          field: { id: 'q1', text: 'Q1', code: 'q1', type: FieldType.Text },
          changeLink: '/back',
          answers: [
            {
              text: 'val1',
              value: 'val1',
              nestedFields: [
                {
                  field: { id: 'q2', text: 'Q2', code: 'q2', type: FieldType.Text },
                  changeLink: '/back',
                  answers: [
                    {
                      text: 'val2',
                      value: 'val2',
                      nestedFields: [
                        {
                          field: { id: 'q3', text: 'Q3', code: 'q3', type: FieldType.Text },
                          changeLink: '/back',
                          answers: [
                            {
                              text: 'val3',
                              value: 'val3',
                              nestedFields: [
                                {
                                  field,
                                  changeLink: '/test-page#q4_id',
                                  answers: [
                                    {
                                      text: 'val4',
                                      value: 'val4',
                                      nestedFields: [],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ])
    })

    it('should return false when the parent cannot be found :(', () => {
      const field: FormWizard.Field = {
        id: 'q4',
        text: 'Q4',
        code: 'q4',
        type: FieldType.Text,
        dependent: { field: 'q3', value: 'val3' },
      }
      const sut = builderWithAnswer('q4', 'val4')
      expect(sut.addNestedField(field, [], '/test-page')).toEqual(false)
    })
  })

  describe('build', () => {
    it('should return empty array when no starting step is found in config', () => {
      const sut = builderWithStep('page-1', { pageTitle: 'page 1', section: undefined, group: 'Test group' })
      expect(sut.build()).toEqual([])
    })

    it('should return relevant fields with filter function applied', () => {
      const fields: FormWizard.Fields = {
        q1: { id: 'q1', text: 'Q1', code: 'q1', type: FieldType.Text },
        q2: { id: 'q2', text: 'Q2', code: 'q2', type: FieldType.Text },
      }

      const options: FormWizard.FormOptions = {
        section: 'test',
        steps: {
          '/step1': {
            pageTitle: 'page 1',
            section: 'test',
            isSectionEntryPoint: true,
            fields: {
              q1: fields.q1,
              q2: fields.q2,
            },
            next: [],
          },
        },
        allFields: fields,
      } as unknown as FormWizard.FormOptions

      const answers: FormWizard.Answers = {
        q1: 'foo',
        q2: ['foo', 'bar'],
      }

      const expected: Field[] = [
        {
          field: options.allFields.q1,
          changeLink: 'step1#q1',
          answers: [
            {
              text: 'foo',
              value: 'foo',
              nestedFields: [],
            },
          ],
        },
      ]

      const filterFn = jest.fn((field: FormWizard.Field) => field.code === 'q1')
      const sut = new TestableFieldDependencyTreeBuilder(options, answers).setStepFieldsFilterFn(filterFn)

      expect(sut.build()).toEqual(expected)

      expect(filterFn).toHaveBeenCalledTimes(2)
      expect(filterFn.mock.calls[0][0]).toEqual(fields.q1)
      expect(filterFn.mock.calls[1][0]).toEqual(fields.q2)
    })
  })

  describe('buildAndFlatten', () => {
    it('should return empty array when no starting step is found in config', () => {
      const sut = builderWithStep('page-1', { pageTitle: 'page 1', section: undefined, group: 'Test group' })
      expect(sut.buildAndFlatten()).toEqual([])
    })

    it('should return relevant fields with filter function applied', () => {
      const fields: FormWizard.Fields = {
        q1: { id: 'q1', text: 'Q1', code: 'q1', type: FieldType.Text },
        q2: { id: 'q2', text: 'Q2', code: 'q2', type: FieldType.Text, dependent: { field: 'q1', value: 'foo' } },
        q3: { id: 'q3', text: 'Q3', code: 'q3', type: FieldType.Text, dependent: { field: 'q1', value: 'foo' } },
      }

      const options: FormWizard.FormOptions = {
        section: 'test',
        steps: {
          '/step1': {
            pageTitle: 'page 1',
            section: 'test',
            isSectionEntryPoint: true,
            fields: {
              q1: fields.q1,
              q2: fields.q2,
              q3: fields.q3,
            },
            next: [],
          },
        },
        allFields: fields,
      } as unknown as FormWizard.FormOptions

      const answers: FormWizard.Answers = {
        q1: 'foo',
        q2: 'bar',
        q3: 'baz',
      }

      const expected: Field[] = [
        {
          field: options.allFields.q1,
          changeLink: 'step1#q1',
          answers: [
            {
              text: 'foo',
              value: 'foo',
              nestedFields: [
                {
                  field: options.allFields.q2,
                  changeLink: 'step1#q2',
                  answers: [
                    {
                      text: 'bar',
                      value: 'bar',
                      nestedFields: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          field: options.allFields.q2,
          changeLink: 'step1#q2',
          answers: [
            {
              text: 'bar',
              value: 'bar',
              nestedFields: [],
            },
          ],
        },
      ]

      const filterFn = jest.fn((field: FormWizard.Field) => field.code !== 'q3')
      const sut = new TestableFieldDependencyTreeBuilder(options, answers).setStepFieldsFilterFn(filterFn)

      expect(sut.buildAndFlatten()).toEqual(expected)

      expect(filterFn).toHaveBeenCalledTimes(3)
      expect(filterFn.mock.calls[0][0]).toEqual(fields.q1)
      expect(filterFn.mock.calls[1][0]).toEqual(fields.q2)
      expect(filterFn.mock.calls[2][0]).toEqual(fields.q3)
    })
  })

  describe('getPageNavigation', () => {
    it('returns both the next step to complete along with a breadcrumb trail', () => {
      const fields: FormWizard.Fields = {
        q1: {
          id: 'q1',
          text: 'Q1',
          code: 'q1',
          type: FieldType.Text,
          validate: [{ type: ValidationType.Required, message: 'Answer Q1' }],
        },
        q2: {
          id: 'q2',
          text: 'Q2',
          code: 'q2',
          type: FieldType.Text,
          dependent: { field: 'q1', value: 'foo' },
          validate: [{ type: ValidationType.Required, message: 'Answer Q2' }],
        },
        q3: {
          id: 'q3',
          text: 'Q3',
          code: 'q3',
          type: FieldType.Text,
          validate: [{ type: ValidationType.Required, message: 'Answer Q3' }],
        },
      }

      const options: FormWizard.FormOptions = {
        section: 'test',
        steps: {
          '/step-1': {
            pageTitle: 'Step 1',
            section: 'test',
            isSectionEntryPoint: true,
            fields: {
              q1: fields.q1,
              q2: fields.q2,
            },
            next: [{ field: 'q2', value: 'baz', next: 'step-3' }, 'step-2'],
          },
          '/step-2': {
            pageTitle: 'Step 2',
            section: 'test',
            fields: {
              q3: fields.q3,
            },
            next: ['step-3'],
          },
          '/step-3': {
            pageTitle: 'Step 3',
            section: 'test',
            fields: {},
            next: [],
          },
        },
        allFields: fields,
      } as unknown as FormWizard.FormOptions

      const answers: FormWizard.Answers = {
        q1: 'foo',
        q2: 'bar',
      }

      const result = new TestableFieldDependencyTreeBuilder(options, answers).getPageNavigation()

      expect(result).toEqual({
        url: 'step-2',
        stepsTaken: ['step-1', 'step-2'],
        isSectionComplete: false,
      })
    })
  })
})
