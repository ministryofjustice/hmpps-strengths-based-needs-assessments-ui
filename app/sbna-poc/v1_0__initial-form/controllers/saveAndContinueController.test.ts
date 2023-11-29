import FormWizard from 'hmpo-form-wizard'
import { Response } from 'express'
import Controller from './saveAndContinueController'

describe('SaveAndContinueController', () => {
  const controller = new Controller({ route: '/' })

  describe('setSectionProgress', () => {
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

    const conditionFn = jest.fn()

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

      controller.setSectionProgress(req)

      expect(conditionFn).toHaveBeenCalledTimes(3)
    })

    it('calls conditionFn with "isValidated" set to "true" when saving', () => {
      const req = buildRequestWith({
        sectionProgressRules: [{ fieldCode: 'foo_section_complete', conditionFn }],
      })

      controller.setSectionProgress(req)

      expect(conditionFn).toHaveBeenLastCalledWith(true, {})
    })

    it('calls conditionFn with "isValidated" set to "false" when saving as draft', () => {
      const req = buildRequestWith({
        sectionProgressRules: [{ fieldCode: 'foo_section_complete', conditionFn }],
        queryParams: { action: 'saveDraft' },
      })

      controller.setSectionProgress(req)

      expect(conditionFn).toHaveBeenLastCalledWith(false, {})
    })

    it('calls conditionFn with form values', () => {
      const formValues = { foo: 'bar' }
      const req = buildRequestWith({
        sectionProgressRules: [{ fieldCode: 'foo_section_complete', conditionFn }],
        formValues,
      })

      controller.setSectionProgress(req)

      expect(conditionFn).toHaveBeenLastCalledWith(true, formValues)
    })

    it('includes the returned value of conditionFn of each field in submittedValues', () => {
      const req = buildRequestWith({
        sectionProgressRules: [
          { fieldCode: 'foo_section_complete', conditionFn: () => 'FOO' },
          { fieldCode: 'bar_section_complete', conditionFn: () => 'BAR' },
          { fieldCode: 'baz_section_complete', conditionFn: () => 'BAZ' },
        ],
      })

      controller.setSectionProgress(req)

      expect(req.form.submittedAnswers).toEqual({
        foo_section_complete: 'FOO',
        bar_section_complete: 'BAR',
        baz_section_complete: 'BAZ',
      })
    })
  })

  describe('updateAssessmentProgress', () => {
    const buildResponseWith = ({ formValues }: { formValues?: Record<string, string | string[]> }) =>
      ({
        locals: {
          values: formValues,
        },
      }) as unknown as Response

    it('sets the sections to complete when their required fields have been completed', () => {
      const res = buildResponseWith({
        formValues: {
          accommodation_section_complete: 'YES',
          accommodation_analysis_section_complete: 'YES',
        },
      })

      controller.updateAssessmentProgress(res)

      expect(res.locals.assessmentProgress?.accommodation).toEqual(true)
    })

    it('sets the sections to incomplete when their required fields have not been completed', () => {
      const res = buildResponseWith({
        formValues: {
          finance_section_complete: 'YES',
          finance_analysis_section_complete: 'NO',
          alcohol_use_section_complete: 'NO',
          alcohol_use_analysis_section_complete: 'YES',
          drug_use_section_complete: 'NO',
          drug_use_analysis_section_complete: 'NO',
        },
      })

      controller.updateAssessmentProgress(res)

      expect(res.locals.assessmentProgress?.finance).toEqual(false)
      expect(res.locals.assessmentProgress?.['alcohol-use']).toEqual(false)
      expect(res.locals.assessmentProgress?.['drug-use']).toEqual(false)
    })
  })
})
