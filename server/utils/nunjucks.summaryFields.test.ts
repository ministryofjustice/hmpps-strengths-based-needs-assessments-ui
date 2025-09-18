import FormWizard from 'hmpo-form-wizard'
import { Field } from '../../app/utils/fieldDependencyTreeBuilder'
import summaryFields, { GetSummaryFieldsOptions } from './nunjucks.summaryFields'
import { FieldType } from '../@types/hmpo-form-wizard/enums'

describe('server/utils/nunjucks.summaryFields', () => {
  it('should return relevant fields and remove "section complete" and "practitioner analysis" questions', () => {
    const sectionConfig = {
      testSection: {
        title: 'Test Section',
        code: 'testSection',
        subsections: {
          subSectionA: {
            title: 'Test Subsection',
            code: 'test-sub',
            stepUrls: {
              step1: 'step-1',
              step2: 'step-2',
            },
          },
        },
      },
    }

    const fields: FormWizard.Fields = {
      q1: { id: 'q1', text: 'Q1', code: 'q1', type: FieldType.Text },
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
      q3: { id: 'q3', text: 'Q3', code: 'q3', type: FieldType.Text, dependent: { field: 'q2_id', value: 'bar' } },
      q4: { id: 'q4', text: 'Q4', code: 'q4', type: FieldType.Text },
      step1_section_complete: {
        id: 'step1_section_complete',
        text: 'A',
        code: 'step1_section_complete',
        type: FieldType.Text,
      },
      step2_section_complete: {
        id: 'step2_section_complete',
        text: 'B',
        code: 'step2_section_complete',
        type: FieldType.Text,
      },
      step1_practitioner_analysis_q1: {
        id: 'step1_practitioner_analysis_q1',
        text: 'C',
        code: 'step1_practitioner_analysis_q1',
        type: FieldType.Text,
      },
      step2_practitioner_analysis_q3: {
        id: 'step2_practitioner_analysis_q3',
        text: 'D',
        code: 'step2_practitioner_analysis_q3',
        type: FieldType.Text,
      },
    }

    const options: GetSummaryFieldsOptions = {
      section: 'testSection',
      route: '/step-1',
      steps: {
        '/step-1': {
          initialStepInSection: true,
          route: '/step-1',
          pageTitle: 'page 1',
          section: 'testSection',
          fields: {
            q1: fields.q1,
            q2_id: fields.q2_id,
            step1_section_complete: fields.step1_section_complete,
            step1_practitioner_analysis_q1: fields.step1_practitioner_analysis_q1,
          },
          next: 'step-2',
        },
        '/step-2': {
          route: '/step-2',
          pageTitle: 'page 2',
          section: 'testSection',
          fields: {
            q3: fields.q3,
            step2_section_complete: fields.step2_section_complete,
            step2_practitioner_analysis_q3: fields.step2_practitioner_analysis_q3,
          },
          next: 'step-3',
        },
        '/step-3': {
          route: '/step-3',
          pageTitle: 'page 3',
          section: 'none',
          fields: {
            q4: fields.q4,
          },
        },
      },
      allFields: fields,
      answers: {
        q1: 'foo',
        q2: ['foo', 'bar'],
        q3: 'baz',
        q4: 'qux',
      },
    }

    const expected = {
      singleFields: [
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
        {
          field: options.allFields.q2_id,
          changeLink: 'step-1#q2_id',
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
                  field: options.allFields.q3,
                  changeLink: 'step-2#q3',
                  answers: [
                    {
                      text: 'baz',
                      value: 'baz',
                      nestedFields: [] as Field[],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ] as Field[],
      collectionFields: [] as Field[],
    }

    // expect(summaryFields(options, sectionConfig)).toEqual(expected) // TODO
  })
})
