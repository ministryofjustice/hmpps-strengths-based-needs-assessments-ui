import FormWizard, { FieldType } from 'hmpo-form-wizard'
import getSummaryFields, {
  addNestedSummaryField,
  Context,
  getAnswers,
  getNextStep,
  getSummaryFieldAnswers,
  resolveNextStep,
  SummaryField,
  SummaryFieldAnswer,
} from './nunjucks.summaryFields'

describe('server/utils/nunjucks.summaryFields', () => {
  const contextWithAnswer = (field: string, value: string | string[]): Context =>
    ({
      answers: {
        [field]: value,
      },
    }) as Context

  const contextWithStep = (stepPath: string, step: FormWizard.RenderedStep): Context =>
    ({
      options: {
        steps: {
          [stepPath]: step,
        },
      },
    }) as Context

  describe('getAnswers', () => {
    it('should return a string value as array', () => {
      const ctx = contextWithAnswer('test', 'val')
      expect(getAnswers('test', ctx)).toEqual(['val'])
    })

    it('should return an array value as array', () => {
      const ctx = contextWithAnswer('test', ['val'])
      expect(getAnswers('test', ctx)).toEqual(['val'])
    })

    it('should return undefined when the field does not exist', () => {
      const ctx = contextWithAnswer('test', 'val')
      expect(getAnswers('foo', ctx)).toBeUndefined()
    })

    it('should return undefined when the value is undefined', () => {
      const ctx = contextWithAnswer('test', undefined)
      expect(getAnswers('foo', ctx)).toBeUndefined()
    })

    it('should return undefined when value is an empty array', () => {
      const ctx = contextWithAnswer('test', [])
      expect(getAnswers('test', ctx)).toBeUndefined()
    })

    it('should return undefined when value is an empty string', () => {
      const ctx = contextWithAnswer('test', '')
      expect(getAnswers('test', ctx)).toBeUndefined()
    })
  })

  describe('resolveNextStep', () => {
    const ctx = contextWithAnswer('test', 'val')

    it('should return a string when the next step is a string', () => {
      expect(resolveNextStep('testStep', ctx)).toEqual('testStep')
    })

    describe('next step is a FieldValueCondition', () => {
      it('should return undefined for a non-existent field', () => {
        const next = { field: 'foo', value: 'bar', next: 'testNext' }
        expect(resolveNextStep(next, ctx)).toBeUndefined()
      })

      it('should return undefined when field value does not match', () => {
        const next = { field: 'test', value: 'foo', next: 'testNext' }
        expect(resolveNextStep(next, ctx)).toBeUndefined()
      })

      it('should return the next step when field value matches', () => {
        const next = { field: 'test', value: 'val', next: 'testNext' }
        expect(resolveNextStep(next, ctx)).toEqual('testNext')
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
        expect(resolveNextStep(next, ctx)).toEqual('finalNext')
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
        expect(resolveNextStep(next, ctx)).toBeUndefined()
      })
    })

    describe('next step is a CallbackCondition', () => {
      it('should throw an exception', () => {
        const next = { fn: () => true, next: 'testStep' }
        expect(() => {
          resolveNextStep(next, ctx)
        }).toThrow('unable to resolve testStep - callbacks are not supported yet')
      })
    })

    describe('next step is a collection of next steps', () => {
      it('should return undefined when next steps is empty', () => {
        const next: FormWizard.Step.NextStep = []
        expect(resolveNextStep(next, ctx)).toBeUndefined()
      })

      it('should return undefined when none of the next steps matches', () => {
        const next: FormWizard.Step.NextStep = [
          { field: 'test', value: 'foo', next: 'testNext1' },
          { field: 'test', value: 'bar', next: 'testNext2' },
          { field: 'test', value: 'baz', next: 'testNext3' },
        ]
        expect(resolveNextStep(next, ctx)).toBeUndefined()
      })

      it('should return the first matching step', () => {
        const next: FormWizard.Step.NextStep = [
          { field: 'test', value: 'foo', next: 'testNext1' },
          { field: 'test', value: 'val', next: 'testNext2' },
          { field: 'test', value: 'val', next: 'testNext3' },
        ]
        expect(resolveNextStep(next, ctx)).toEqual('testNext2')
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
        expect(resolveNextStep(next, ctx)).toEqual('finalNext')
      })
    })
  })

  describe('getNextStep', () => {
    const currentStep: FormWizard.RenderedStep = { pageTitle: 'page 1', section: 'none' }
    const nextStep: FormWizard.RenderedStep = { pageTitle: 'page 2', section: 'none' }
    const ctx = contextWithStep('/page-2', nextStep)

    it('should return the path and step object of the next step', () => {
      currentStep.next = 'page-2'
      expect(getNextStep(currentStep, ctx)).toEqual(['/page-2', nextStep])
    })

    it('should strip anchor tags from the path of the next step', () => {
      currentStep.next = 'page-2#question'
      expect(getNextStep(currentStep, ctx)).toEqual(['/page-2', nextStep])
    })

    it('should return empty array when no next step is resolved', () => {
      currentStep.next = []
      expect(getNextStep(currentStep, ctx)).toEqual([])
    })
  })

  describe('getSummaryFieldAnswers', () => {
    const optionsField: FormWizard.Field = {
      text: 'Q1',
      code: 'q1',
      type: undefined,
      options: [
        { text: 'Value 1', value: 'val1', kind: 'option' },
        { text: 'Value 2', value: 'val2', kind: 'option' },
      ],
    }
    const textField: FormWizard.Field = { text: 'Q2', code: 'q2', type: undefined }

    it('should return radio button answer', () => {
      optionsField.type = FieldType.Radio
      const ctx = contextWithAnswer('q1', 'val1')
      const expected: SummaryFieldAnswer[] = [{ text: 'Value 1', value: 'val1', nestedFields: [] }]
      expect(getSummaryFieldAnswers(optionsField, ctx)).toEqual(expected)
    })

    it('should return dropdown answer', () => {
      optionsField.type = FieldType.Dropdown
      const ctx = contextWithAnswer('q1', 'val2')
      const expected: SummaryFieldAnswer[] = [{ text: 'Value 2', value: 'val2', nestedFields: [] }]
      expect(getSummaryFieldAnswers(optionsField, ctx)).toEqual(expected)
    })

    it('should return checkbox answers', () => {
      optionsField.type = FieldType.CheckBox
      const ctx = contextWithAnswer('q1', ['val1', 'val2'])
      const expected: SummaryFieldAnswer[] = [
        { text: 'Value 1', value: 'val1', nestedFields: [] },
        { text: 'Value 2', value: 'val2', nestedFields: [] },
      ]
      expect(getSummaryFieldAnswers(optionsField, ctx)).toEqual(expected)
    })

    it('should return textarea answer', () => {
      textField.type = FieldType.TextArea
      const ctx = contextWithAnswer('q2', 'free text')
      const expected: SummaryFieldAnswer[] = [{ text: 'free text', value: 'free text', nestedFields: [] }]
      expect(getSummaryFieldAnswers(textField, ctx)).toEqual(expected)
    })

    it('should return text field answer', () => {
      textField.type = FieldType.Text
      const ctx = contextWithAnswer('q2', 'free text')
      const expected: SummaryFieldAnswer[] = [{ text: 'free text', value: 'free text', nestedFields: [] }]
      expect(getSummaryFieldAnswers(textField, ctx)).toEqual(expected)
    })

    it('should return date field answer', () => {
      textField.type = FieldType.Date
      const ctx = contextWithAnswer('q2', '1970-01-01')
      const expected: SummaryFieldAnswer[] = [{ text: '01 January 1970', value: '01 January 1970', nestedFields: [] }]
      expect(getSummaryFieldAnswers(textField, ctx)).toEqual(expected)
    })

    it('should return an empty array when no answer exists', () => {
      optionsField.type = FieldType.Radio
      const ctx = contextWithAnswer('q2', 'free text')
      expect(getSummaryFieldAnswers(optionsField, ctx)).toEqual([])
    })
  })

  describe('addNestedSummaryField', () => {
    it('should find the parent field recursively and nest the summary field into the parent field answer', () => {
      const summaryFields: SummaryField[] = [
        {
          field: { text: 'Q0', code: 'q0', type: FieldType.Text },
          backLink: '/back',
          answers: [
            {
              text: 'val0',
              value: 'val0',
              nestedFields: [],
            },
          ],
        },
        {
          field: { text: 'Q1', code: 'q1', type: FieldType.Text },
          backLink: '/back',
          answers: [
            {
              text: 'val1',
              value: 'val1',
              nestedFields: [
                {
                  field: { text: 'Q2', code: 'q2', type: FieldType.Text },
                  backLink: '/back',
                  answers: [
                    {
                      text: 'val2',
                      value: 'val2',
                      nestedFields: [
                        {
                          field: { text: 'Q3', code: 'q3', type: FieldType.Text },
                          backLink: '/back',
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
      const ctx = contextWithAnswer('q4', 'val4')

      expect(addNestedSummaryField(field, summaryFields, ctx, '/test-page')).toEqual(true)
      expect(summaryFields).toEqual([
        {
          field: { text: 'Q0', code: 'q0', type: FieldType.Text },
          backLink: '/back',
          answers: [
            {
              text: 'val0',
              value: 'val0',
              nestedFields: [],
            },
          ],
        },
        {
          field: { text: 'Q1', code: 'q1', type: FieldType.Text },
          backLink: '/back',
          answers: [
            {
              text: 'val1',
              value: 'val1',
              nestedFields: [
                {
                  field: { text: 'Q2', code: 'q2', type: FieldType.Text },
                  backLink: '/back',
                  answers: [
                    {
                      text: 'val2',
                      value: 'val2',
                      nestedFields: [
                        {
                          field: { text: 'Q3', code: 'q3', type: FieldType.Text },
                          backLink: '/back',
                          answers: [
                            {
                              text: 'val3',
                              value: 'val3',
                              nestedFields: [
                                {
                                  field,
                                  backLink: '/test-page#q4_id',
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
        text: 'Q4',
        code: 'q4',
        type: FieldType.Text,
        dependent: { field: 'q3', value: 'val3' },
      }
      const ctx = contextWithAnswer('q4', 'val4')
      expect(addNestedSummaryField(field, [], ctx, '/test-page')).toEqual(false)
    })
  })

  describe('getSummaryFields', () => {
    it('should return empty array when no starting step is found in config', () => {
      const ctx = contextWithStep('page-1', { pageTitle: 'page 1', section: undefined })
      expect(getSummaryFields(ctx)).toEqual([])
    })

    it('should return relevant summary fields and remove "section complete" and "practitioner analysis" questions', () => {
      const fields: FormWizard.Fields = {
        q1: { text: 'Q1', code: 'q1', type: FieldType.Text },
        q2_id: {
          id: 'q2_id',
          text: 'Q2',
          code: 'q2',
          type: FieldType.CheckBox,
          options: [
            { text: 'Foo', value: 'foo', kind: 'option' },
            { text: 'Bar', value: 'bar', kind: 'option' },
          ],
        },
        q3: { text: 'Q3', code: 'q3', type: FieldType.Text, dependent: { field: 'q2_id', value: 'bar' } },
        q4: { text: 'Q4', code: 'q4', type: FieldType.Text },
        step1_section_complete: { text: 'A', code: 'step1_section_complete', type: FieldType.Text },
        step2_section_complete: { text: 'B', code: 'step2_section_complete', type: FieldType.Text },
        step1_practitioner_analysis_q1: { text: 'C', code: 'step1_practitioner_analysis_q1', type: FieldType.Text },
        step2_practitioner_analysis_q3: { text: 'D', code: 'step2_practitioner_analysis_q3', type: FieldType.Text },
      }

      const ctx: Context = {
        options: {
          section: 'test',
          steps: {
            '/step1': {
              pageTitle: 'page 1',
              section: 'test',
              navigationOrder: 1,
              fields: {
                q1: fields.q1,
                q2_id: fields.q2_id,
                step1_section_complete: fields.step1_section_complete,
                step1_practitioner_analysis_q1: fields.step1_practitioner_analysis_q1,
              },
              next: 'step2',
            },
            '/step2': {
              pageTitle: 'page 2',
              section: 'test',
              fields: {
                q3: fields.q3,
                step2_section_complete: fields.step2_section_complete,
                step2_practitioner_analysis_q3: fields.step2_practitioner_analysis_q3,
              },
              next: 'step3',
            },
            '/step3': {
              pageTitle: 'page 3',
              section: 'none',
              fields: {
                q4: fields.q4,
              },
            },
          },
          allFields: fields,
        },
        answers: {
          q1: 'foo',
          q2: ['foo', 'bar'],
          q3: 'baz',
          q4: 'qux',
        },
      }

      const expected: SummaryField[] = [
        {
          field: ctx.options.allFields.q1,
          backLink: 'step1#q1',
          answers: [
            {
              text: 'foo',
              value: 'foo',
              nestedFields: [],
            },
          ],
        },
        {
          field: ctx.options.allFields.q2_id,
          backLink: 'step1#q2_id',
          answers: [
            {
              text: 'Foo',
              value: 'foo',
              nestedFields: [],
            },
            {
              text: 'Bar',
              value: 'bar',
              nestedFields: [
                {
                  field: ctx.options.allFields.q3,
                  backLink: 'step2#q3',
                  answers: [
                    {
                      text: 'baz',
                      value: 'baz',
                      nestedFields: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]

      expect(getSummaryFields(ctx)).toEqual(expected)
    })
  })
})
