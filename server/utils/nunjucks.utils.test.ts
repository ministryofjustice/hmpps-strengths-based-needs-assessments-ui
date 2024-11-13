import FormWizard from 'hmpo-form-wizard'
import { formatDateForDisplay, practitionerAnalysisStarted, toErrorSummary } from './nunjucks.utils'
import { FieldType } from '../@types/hmpo-form-wizard/enums'

describe('server/utils/nunjucks.utils', () => {
  describe('toErrorSummary', () => {
    it('', () => {
      const errors = {
        foo: new FormWizard.Controller.Error('foo', { message: 'Foo is required' }, null),
        bar: new FormWizard.Controller.Error('bar', { message: 'Bar is required' }, null),
        baz: new FormWizard.Controller.Error('baz', { message: 'Baz is required' }, null),
      }

      expect(toErrorSummary(errors)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ text: 'Foo is required', href: '#foo-error' }),
          expect.objectContaining({ text: 'Bar is required', href: '#bar-error' }),
          expect.objectContaining({ text: 'Baz is required', href: '#baz-error' }),
        ]),
      )
    })
  })

  describe('formatDateForDisplay', () => {
    it('returns the data in the format', () => {
      expect(formatDateForDisplay('2023-08-02')).toEqual('02 August 2023')
    })

    it('returns null when passed a null/undefined value', () => {
      expect(formatDateForDisplay(null)).toEqual(null)
      expect(formatDateForDisplay(undefined)).toEqual(null)
    })

    it('returns null when passed an invalid date', () => {
      expect(formatDateForDisplay('99-99-9999')).toEqual(null)
      expect(formatDateForDisplay('foo date')).toEqual(null)
      expect(formatDateForDisplay('')).toEqual(null)
    })
  })

  describe('practitionerAnalysisStarted', () => {
    it('returns true when the practitioner analysis section has been started', () => {
      const options = {
        steps: {
          '/foo': {
            pageTitle: 'Foo step',
            section: 'test-section',
            fields: {
              test_section_practitioner_analysis_question: {
                text: 'Foo field 1',
                code: 'test_section_practitioner_analysis_question',
                type: FieldType.Text,
              },
            },
          },
        } as FormWizard.RenderedSteps,
        section: 'test-section',
      } as FormWizard.FormOptions

      const answers: Record<string, string | string[]> = {
        test_section_practitioner_analysis_question: 'Some details',
      }

      const result = practitionerAnalysisStarted(options, answers)
      expect(result).toEqual(true)
    })

    it('returns false when the practitioner analysis section has not been started', () => {
      const options = {
        steps: {
          '/foo': {
            pageTitle: 'Foo step',
            section: 'test-section',
            fields: {
              test_section_practitioner_analysis_question: {
                text: 'Foo field 1',
                code: 'test_section_practitioner_analysis_question',
                type: FieldType.Text,
              },
            },
          },
        } as FormWizard.RenderedSteps,
        section: 'test-section',
      } as FormWizard.FormOptions

      const answers: Record<string, string | string[]> = {}

      const result = practitionerAnalysisStarted(options, answers)
      expect(result).toEqual(false)
    })

    it('ignores fields that are not part of the current section', () => {
      const options = {
        steps: {
          '/foo': {
            pageTitle: 'Foo step',
            section: 'test-section',
            fields: {
              test_section_practitioner_analysis_question: {
                text: 'Foo field 1',
                code: 'test_section_practitioner_analysis_question',
                type: FieldType.Text,
              },
            },
          },
          '/bar': {
            pageTitle: 'Bar step',
            section: 'other-section',
            fields: {
              other_section_practitioner_analysis_question: {
                text: 'Bar field 1',
                code: 'other_section_practitioner_analysis_question',
                type: FieldType.Text,
              },
            },
          },
        } as FormWizard.RenderedSteps,
        section: 'test-section',
      } as FormWizard.FormOptions

      const answers: Record<string, string | string[]> = {
        other_section_practitioner_analysis_question: 'Some details',
      }

      const result = practitionerAnalysisStarted(options, answers)
      expect(result).toEqual(false)
    })
  })
})
