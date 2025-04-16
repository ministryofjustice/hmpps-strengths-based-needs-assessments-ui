import FormWizard from 'hmpo-form-wizard'
import { display, practitionerAnalysisStarted, toErrorSummary } from './nunjucks.utils'
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

  describe('practitionerAnalysisStarted', () => {
    it('returns true when the practitioner analysis section has been started', () => {
      const options = {
        steps: {
          '/foo': {
            pageTitle: 'Foo step',
            section: 'test-section',
            group: 'Test group',
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
            group: 'Test group',
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
            group: 'Test group',
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
            group: 'Test group',
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

  describe('display', () => {
    it('returns html if set', () => {
      expect(display({ text: 'Test', html: '<b>Test</b>', value: '', nestedFields: [] })).toEqual('<b>Test</b>')
    })

    it('returns text if html is not set', () => {
      expect(display({ text: 'Test\nnew line', value: '', nestedFields: [] })).toEqual('Test<br>\nnew line')
    })
  })
})
