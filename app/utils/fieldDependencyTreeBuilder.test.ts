import FormWizard from 'hmpo-form-wizard'
import { FieldType, ValidationType } from '../../server/@types/hmpo-form-wizard/enums'
import FieldDependencyTreeBuilder from './fieldDependencyTreeBuilder'
import AnswersProvider, { Field } from './AnswersProvider'
import FieldMapper from './FieldMapper'

describe('app/utils/fieldDependencyTreeBuilder', () => {
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

  // Helper used by nested-field tests to create a mapper configured with an answers override
  const builderWithAnswer = (field: string, value: string | string[]) =>
    new FieldMapper({}, new AnswersProvider({ [field]: value }))

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
      const sut = new FieldDependencyTreeBuilder(
        { section: 'none', route: '', steps: {}, allFields: {} },
        {},
        mockSections,
      )
      expect(sut.getAllFieldsInSectionFromSteps()).toEqual([])
    })

    it('should return relevant fields with filter function applied', () => {
      const fields: FormWizard.Fields = {
        q1: { id: 'q1', text: 'Q1', code: 'q1', type: FieldType.Text },
        q2: { id: 'q2', text: 'Q2', code: 'q2', type: FieldType.Text },
      }

      const options: FormWizard.FormOptions = {
        section: 'testSection',
        route: '/step-1',
        steps: {
          '/step-1': {
            initialStepInSection: true,
            route: '/step-1',
            pageTitle: 'page 1',
            section: 'testSection',
            navigationOrder: 1,
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
          changeLink: 'step-1#q1',
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
      const sut = new FieldDependencyTreeBuilder(options, answers, mockSections).setStepFieldsFilterFn(filterFn)

      expect(sut.getAllFieldsInSectionFromSteps()).toEqual(expected)

      expect(filterFn).toHaveBeenCalledTimes(2)
      expect(filterFn.mock.calls[0][0]).toEqual(fields.q1)
      expect(filterFn.mock.calls[1][0]).toEqual(fields.q2)
    })
  })

  describe('buildAndFlatten', () => {
    it('should return empty array when no starting step is found in config', () => {
      const sut = new FieldDependencyTreeBuilder(
        { section: 'none', route: '', steps: {}, allFields: {} },
        {},
        mockSections,
      )
      expect(sut.getAllNestedFieldsInSectionFromSteps()).toEqual([])
    })

    it('should return relevant fields with filter function applied', () => {
      const fields: FormWizard.Fields = {
        q1: { id: 'q1', text: 'Q1', code: 'q1', type: FieldType.Text },
        q2: { id: 'q2', text: 'Q2', code: 'q2', type: FieldType.Text, dependent: { field: 'q1', value: 'foo' } },
        q3: { id: 'q3', text: 'Q3', code: 'q3', type: FieldType.Text, dependent: { field: 'q1', value: 'foo' } },
      }

      const options: FormWizard.FormOptions = {
        section: 'testSection',
        route: '/step-1',
        steps: {
          '/step-1': {
            initialStepInSection: true,
            route: '/step-1',
            pageTitle: 'page 1',
            section: 'testSection',
            navigationOrder: 1,
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
          changeLink: 'step-1#q1',
          answers: [
            {
              text: 'foo',
              value: 'foo',
              nestedFields: [
                {
                  field: options.allFields.q2,
                  changeLink: 'step-1#q2',
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
          changeLink: 'step-1#q2',
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
      const sut = new FieldDependencyTreeBuilder(options, answers, mockSections).setStepFieldsFilterFn(filterFn)

      expect(sut.getAllNestedFieldsInSectionFromSteps()).toEqual(expected)

      expect(filterFn).toHaveBeenCalledTimes(3)
      expect(filterFn.mock.calls[0][0]).toEqual(fields.q1)
      expect(filterFn.mock.calls[1][0]).toEqual(fields.q2)
      expect(filterFn.mock.calls[2][0]).toEqual(fields.q3)
    })
  })

  // Really we should be using a jest mock for `sections` imported by fieldDependencyTreeBuilder
  // but I can't make it work so added an override to the FieldDependencyTreeBuilder constructor instead.
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
        section: 'testSection',
        route: '/step-1',
        steps: {
          '/step-1': {
            route: '/step-1',
            pageTitle: 'Step 1',
            section: 'testSection',
            initialStepInSection: true,
            navigationOrder: 1,
            fields: {
              q1: fields.q1,
              q2: fields.q2,
            },
            next: [{ field: 'q2', value: 'baz', next: 'step-3' }, 'step-2'],
          },
          '/step-2': {
            route: '/step-2',
            pageTitle: 'Step 2',
            section: 'testSection',
            fields: {
              q3: fields.q3,
            },
            next: ['step-3'],
          },
          '/step-3': {
            route: '/step-3',
            pageTitle: 'Step 3',
            section: 'testSection',
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

      const result = new FieldDependencyTreeBuilder(options, answers, mockSections).getPageNavigation()

      expect(result).toEqual({
        url: 'step-2',
        stepsTaken: ['step-1', 'step-2'],
        isSectionComplete: false,
      })
    })
  })
})
