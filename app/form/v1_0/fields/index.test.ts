import FormWizard from 'hmpo-form-wizard'
import { FieldType } from '../../../../server/@types/hmpo-form-wizard/enums'
import buildFields, { toFormWizardFields } from './index'
import { SectionConfig } from '../config/sections'
import { utils } from './common'

describe('fields/index.ts', () => {
  describe('toFormWizardFields', () => {
    it('takes and array of fields and constructs a map', () => {
      const fields: FormWizard.Field[] = [
        {
          text: 'First Question',
          code: 'first_question',
          type: FieldType.Text,
        },
        {
          text: 'Second Question',
          code: 'second_question',
          type: FieldType.Text,
        },
      ]

      const result = fields.reduce(toFormWizardFields('section_code'), {})

      expect(result).toEqual({
        first_question: {
          text: 'First Question',
          code: 'first_question',
          type: FieldType.Text,
          section: 'section_code',
        },
        second_question: {
          text: 'Second Question',
          code: 'second_question',
          type: FieldType.Text,
          section: 'section_code',
        },
      })
    })

    it('uses the "id" rather than the "code" when provided', () => {
      const fields: FormWizard.Field[] = [
        {
          text: 'First Question',
          code: 'first_question_a',
          id: 'first_question',
          type: FieldType.Text,
        },
        {
          text: 'Second Question',
          code: 'second_question',
          type: FieldType.Text,
        },
      ]

      const result = fields.reduce(toFormWizardFields('section_code'), {})

      expect(result).toEqual({
        first_question: {
          text: 'First Question',
          code: 'first_question_a',
          id: 'first_question',
          type: FieldType.Text,
          section: 'section_code',
        },
        second_question: {
          text: 'Second Question',
          code: 'second_question',
          type: FieldType.Text,
          section: 'section_code',
        },
      })
    })
  })

  describe('buildFields', () => {
    it('takes a list of sections and extracts the fields', () => {
      const sections: SectionConfig[] = [
        {
          steps: [
            {
              url: '/first_section/first_step',
              fields: [
                {
                  text: 'First Question',
                  code: 'first_section_first_question',
                  type: FieldType.Text,
                },
              ],
            },
            {
              url: '/first_section/second_step',
              fields: [
                {
                  text: 'Second Question',
                  code: 'first_section_second_question',
                  type: FieldType.Text,
                },
              ],
            },
          ],
          section: {
            title: 'First Section',
            code: 'first_section',
          },
        },
        {
          steps: [
            {
              url: '/second_section/first_step',
              fields: [
                {
                  text: 'First Question',
                  code: 'second_section_first_question',
                  type: FieldType.Text,
                },
              ],
            },
          ],
          section: {
            title: 'Second Section',
            code: 'second_section',
          },
        },
      ]

      const result = buildFields(sections)

      expect(result.assessment_complete.code).toEqual('assessment_complete')
      expect(result.assessment_complete.type).toEqual(FieldType.Radio)
      expect(result.assessment_complete.options).toEqual(utils.yesNoOptions)
      expect(result.assessment_complete.hidden).toEqual(true)
      expect(result.assessment_complete.section).toEqual('assessment')

      expect(result.first_section_first_question).toEqual({
        text: 'First Question',
        code: 'first_section_first_question',
        type: FieldType.Text,
        section: 'first_section',
      })

      expect(result.first_section_second_question).toEqual({
        text: 'Second Question',
        code: 'first_section_second_question',
        type: FieldType.Text,
        section: 'first_section',
      })

      expect(result.second_section_first_question).toEqual({
        text: 'First Question',
        code: 'second_section_first_question',
        type: FieldType.Text,
        section: 'second_section',
      })
    })
  })
})
