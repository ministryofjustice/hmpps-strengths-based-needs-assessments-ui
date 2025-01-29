import FormWizard from 'hmpo-form-wizard'
import { Response } from 'express'
import Controller, { Progress, SectionCompleteRule } from './saveAndContinueController'

describe('SaveAndContinueController', () => {
  const controller = new Controller({ route: '/' })

  describe('getSectionProgressAnswers', () => {
    const conditionFn = jest.fn()

    const buildRequestWith = ({
      sectionProgressRules = [],
      queryParams = {},
      formValues = {},
    }: {
      sectionProgressRules?: FormWizard.SectionProgressRule[]
      queryParams?: Record<string, string>
      formValues?: Record<string, string | string[]>
    }) =>
      ({
        form: {
          options: {
            sectionProgressRules,
          },
          values: formValues,
          submittedAnswers: {},
        },
        query: queryParams,
      }) as unknown as FormWizard.Request

    beforeEach(() => {
      conditionFn.mockReset()
    })

    it('calls conditionFn', () => {
      const req = buildRequestWith({
        sectionProgressRules: [
          { fieldCode: 'foo_section_complete', conditionFn },
          { fieldCode: 'bar_section_complete', conditionFn },
          { fieldCode: 'baz_section_complete', conditionFn },
        ],
      })

      controller.getSectionProgressAnswers(req, true)

      expect(conditionFn).toHaveBeenCalledTimes(3)
    })

    it('calls conditionFn with "isValidated" set to "true" when saving', () => {
      const req = buildRequestWith({
        sectionProgressRules: [{ fieldCode: 'foo_section_complete', conditionFn }],
      })

      controller.getSectionProgressAnswers(req, true)

      expect(conditionFn).toHaveBeenLastCalledWith(true, {})
    })

    it('calls conditionFn with "isValidated" set to "false" when form failed validation', () => {
      const req = buildRequestWith({
        sectionProgressRules: [{ fieldCode: 'foo_section_complete', conditionFn }],
      })

      controller.getSectionProgressAnswers(req, false)

      expect(conditionFn).toHaveBeenLastCalledWith(false, {})
    })

    it('calls conditionFn with form values', () => {
      const formValues = { foo: 'bar' }
      const req = buildRequestWith({
        sectionProgressRules: [{ fieldCode: 'foo_section_complete', conditionFn }],
        formValues,
      })

      controller.getSectionProgressAnswers(req, true)

      expect(conditionFn).toHaveBeenLastCalledWith(true, formValues)
    })

    it('marks the assessment as complete if all subsections are complete', () => {
      const req = buildRequestWith({
        sectionProgressRules: [
          { fieldCode: 'foo_section_complete', conditionFn: () => true },
          { fieldCode: 'bar_section_complete', conditionFn: () => true },
          { fieldCode: 'baz_section_complete', conditionFn: () => true },
        ],
      })

      const result = controller.getSectionProgressAnswers(req, true)

      expect(result).toEqual({
        foo_section_complete: 'YES',
        bar_section_complete: 'YES',
        baz_section_complete: 'YES',
      })
    })

    it('marks the assessment as incomplete is a subsection is incomplete', () => {
      const req = buildRequestWith({
        sectionProgressRules: [
          { fieldCode: 'foo_section_complete', conditionFn: () => true },
          { fieldCode: 'bar_section_complete', conditionFn: () => false },
          { fieldCode: 'baz_section_complete', conditionFn: () => true },
        ],
      })

      const result = controller.getSectionProgressAnswers(req, true)

      expect(result).toEqual({
        foo_section_complete: 'YES',
        bar_section_complete: 'NO',
        baz_section_complete: 'YES',
      })
    })
  })

  describe('getAssessmentProgress', () => {
    it('marks the section as complete if all subsections are complete', () => {
      const answers: FormWizard.Answers = {
        foo_section_complete: 'YES',
        bar_section_complete: 'YES',
      }

      const sectionCompleteRules: SectionCompleteRule[] = [
        { sectionName: 'test_section', fieldCodes: ['foo_section_complete', 'bar_section_complete'] },
      ]

      const result = controller.getAssessmentProgress(answers, sectionCompleteRules)

      expect(result).toEqual({
        test_section: true,
      })
    })

    it('marks the section as incomplete is a subsection is incomplete', () => {
      const answers: FormWizard.Answers = {
        foo_section_complete: 'YES',
        bar_section_complete: 'NO',
      }

      const sectionCompleteRules: SectionCompleteRule[] = [
        { sectionName: 'test_section', fieldCodes: ['foo_section_complete', 'bar_section_complete'] },
      ]

      const result = controller.getAssessmentProgress(answers, sectionCompleteRules)

      expect(result).toEqual({
        test_section: false,
      })
    })
  })

  describe('getAssessmentCompletionAnswers', () => {
    it('marks the assessment as complete if all sections are complete', () => {
      const progress: Progress = {
        foo_section_complete: true,
        bar_section_complete: true,
        baz_section_complete: true,
      }

      const result = controller.getAssessmentCompletionAnswers(progress)

      expect(result).toEqual({
        assessment_complete: 'YES',
      })
    })

    it('marks the assessment as incomplete if a section is incomplete', () => {
      const progress: Progress = {
        foo_section_complete: true,
        bar_section_complete: false,
        baz_section_complete: true,
      }

      const result = controller.getAssessmentCompletionAnswers(progress)

      expect(result).toEqual({
        assessment_complete: 'NO',
      })
    })
  })

  describe('updateAssessmentProgress', () => {
    const buildRequestWith = ({ persistedAnswers = {} }: { persistedAnswers?: Record<string, string | string[]> }) =>
      ({
        form: {
          options: {
            sectionProgressRules: [],
          },
          values: {},
          submittedAnswers: {},
          persistedAnswers,
        },
      }) as unknown as FormWizard.Request

    const buildResponseWith = ({
      formValues,
      sectionProgressRules = [],
    }: {
      formValues?: Record<string, string | string[]>
      sectionProgressRules?: Array<{ sectionName: string; fieldCodes: string[] }>
    }) =>
      ({
        locals: {
          values: formValues,
          form: { sectionProgressRules },
        },
      }) as unknown as Response

    it('sets the sections to complete when their required fields have been completed', () => {
      const req = buildRequestWith({
        persistedAnswers: {
          accommodation_section_complete: 'YES',
          accommodation_analysis_section_complete: 'YES',
        },
      })

      const res = buildResponseWith({
        sectionProgressRules: [
          {
            sectionName: 'accommodation',
            fieldCodes: ['accommodation_section_complete', 'accommodation_analysis_section_complete'],
          },
        ],
      })

      const progress = controller.getAssessmentProgress(req.form.persistedAnswers, res.locals.form.sectionProgressRules)

      expect(progress.accommodation).toEqual(true)
    })

    it('sets the sections to incomplete when their required fields have not been completed', () => {
      const req = buildRequestWith({
        persistedAnswers: {
          finance_section_complete: 'YES',
          finance_analysis_section_complete: 'NO',
          alcohol_use_section_complete: 'NO',
          alcohol_use_analysis_section_complete: 'YES',
          drug_use_section_complete: 'NO',
          drug_use_analysis_section_complete: 'NO',
        },
      })
      const res = buildResponseWith({
        sectionProgressRules: [
          {
            sectionName: 'alcohol-use',
            fieldCodes: ['alcohol_use_section_complete', 'alcohol_use_analysis_section_complete'],
          },
          { sectionName: 'drug-use', fieldCodes: ['drug_use_section_complete', 'drug_use_analysis_section_complete'] },
          { sectionName: 'finance', fieldCodes: ['finance_section_complete', 'finance_analysis_section_complete'] },
        ],
      })

      const progress = controller.getAssessmentProgress(req.form.persistedAnswers, res.locals.form.sectionProgressRules)

      expect(progress.finance).toEqual(false)
      expect(progress['alcohol-use']).toEqual(false)
      expect(progress['drug-use']).toEqual(false)
    })
  })
})
