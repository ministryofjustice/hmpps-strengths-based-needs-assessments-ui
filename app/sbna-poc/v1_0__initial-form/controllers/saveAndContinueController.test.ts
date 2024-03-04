import FormWizard from 'hmpo-form-wizard'
import { Response } from 'express'
import Controller, { Progress } from './saveAndContinueController'

describe('SaveAndContinueController', () => {
  const controller = new Controller({ route: '/' })

  describe('setSectionProgress', () => {
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

      controller.setSectionProgress(req, true)

      expect(conditionFn).toHaveBeenCalledTimes(3)
    })

    it('calls conditionFn with "isValidated" set to "true" when saving', () => {
      const req = buildRequestWith({
        sectionProgressRules: [{ fieldCode: 'foo_section_complete', conditionFn }],
      })

      controller.setSectionProgress(req, true)

      expect(conditionFn).toHaveBeenLastCalledWith(true, {})
    })

    it('calls conditionFn with "isValidated" set to "false" when form failed validation', () => {
      const req = buildRequestWith({
        sectionProgressRules: [{ fieldCode: 'foo_section_complete', conditionFn }],
      })

      controller.setSectionProgress(req, false)

      expect(conditionFn).toHaveBeenLastCalledWith(false, {})
    })

    it('calls conditionFn with form values', () => {
      const formValues = { foo: 'bar' }
      const req = buildRequestWith({
        sectionProgressRules: [{ fieldCode: 'foo_section_complete', conditionFn }],
        formValues,
      })

      controller.setSectionProgress(req, true)

      expect(conditionFn).toHaveBeenLastCalledWith(true, formValues)
    })

    it('includes the returned value of conditionFn of each field in submittedAnswers', () => {
      const req = buildRequestWith({
        sectionProgressRules: [
          { fieldCode: 'foo_section_complete', conditionFn: () => 'FOO' },
          { fieldCode: 'bar_section_complete', conditionFn: () => 'BAR' },
          { fieldCode: 'baz_section_complete', conditionFn: () => 'BAZ' },
        ],
      })

      controller.setSectionProgress(req, true)

      expect(req.form.values).toEqual({
        foo_section_complete: 'FOO',
        bar_section_complete: 'BAR',
        baz_section_complete: 'BAZ',
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

      controller.updateAssessmentProgress(req, res)

      expect(res.locals.sectionProgress?.accommodation).toEqual(true)
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

      controller.updateAssessmentProgress(req, res)

      expect(res.locals.sectionProgress?.finance).toEqual(false)
      expect(res.locals.sectionProgress?.['alcohol-use']).toEqual(false)
      expect(res.locals.sectionProgress?.['drug-use']).toEqual(false)
    })
  })

  describe('resetResumeUrl', () => {
    const sessionModel = {
      get: jest.fn(),
      set: jest.fn(),
    }

    const buildRequestWith = (sectionName: string) =>
      ({
        form: {
          options: {
            section: sectionName,
          },
        },
        sessionModel,
      }) as unknown as FormWizard.Request

    const withResumeState = (state: Record<string, string>) => (key: string) => (key === 'resumeState' ? state : null)

    beforeEach(() => {
      sessionModel.get.mockReset()
      sessionModel.set.mockReset()
    })

    it('resets the resume URL for the given section', () => {
      const req = buildRequestWith('foo_section')
      sessionModel.get.mockImplementation(withResumeState({ foo_section: 'foo' }))

      controller.resetResumeUrl(req)

      expect(sessionModel.set).toBeCalledWith('resumeState', { foo_section: null })
    })

    it('does not reset the resume URL for other sections', () => {
      const req = buildRequestWith('foo_section')
      sessionModel.get.mockImplementation(withResumeState({ foo_section: 'foo', bar_section: 'bar' }))

      controller.resetResumeUrl(req)

      expect(sessionModel.set).toBeCalledWith('resumeState', { foo_section: null, bar_section: 'bar' })
    })

    it('handles when there is no resume URL for the given section', () => {
      const req = buildRequestWith('foo_section')
      sessionModel.get.mockImplementation(withResumeState({}))

      controller.resetResumeUrl(req)

      expect(sessionModel.set).toBeCalledWith('resumeState', { foo_section: null })
    })

    it('handles when there is no resume state', () => {
      const req = buildRequestWith('foo_section')
      sessionModel.get.mockReturnValue(undefined)

      controller.resetResumeUrl(req)

      expect(sessionModel.set).toBeCalledWith('resumeState', { foo_section: null })
    })
  })

  describe('getResumeUrl', () => {
    const sessionModel = {
      get: jest.fn(),
      set: jest.fn(),
    }

    const buildRequestWith = ({
      url = '/',
      sectionName,
      action,
    }: {
      url?: string
      sectionName?: string
      action?: string
    }) =>
      ({
        form: {
          options: {
            section: sectionName,
            steps: {
              [`/${sectionName}-page-1`]: {
                section: sectionName,
              },
              [`/${sectionName}-page-2`]: {
                section: sectionName,
              },
              '/other-section': {
                section: 'other',
              },
            },
          },
        },
        url,
        query: { action },
        sessionModel,
      }) as unknown as FormWizard.Request

    const withResumeState = (state: Record<string, string>) => (key: string) => (key === 'resumeState' ? state : null)

    beforeEach(() => {
      sessionModel.get.mockReset()
      sessionModel.set.mockReset()
    })

    it('returns null when there is no resume state', () => {
      const req = buildRequestWith({ url: '/foo', sectionName: 'foo_section' })
      sessionModel.get.mockImplementation(withResumeState({}))
      const sectionProgress: Progress = {}

      const resumeUrl = controller.getResumeUrl(req, sectionProgress)

      expect(resumeUrl).toEqual(null)
    })

    it('does not return a resume URL when navigating within the same section', () => {
      const req = buildRequestWith({ url: '/foo', sectionName: 'foo_section' })
      sessionModel.get.mockImplementation(withResumeState({ foo_section: '/foo/bar', lastSection: 'foo_section' }))
      const sectionProgress: Progress = {}

      const resumeUrl = controller.getResumeUrl(req, sectionProgress)

      expect(resumeUrl).toEqual(null)
    })

    it('returns a resume URL when navigating between sections', () => {
      const req = buildRequestWith({ url: '/foo', sectionName: 'foo_section', action: 'resume' })
      sessionModel.get.mockImplementation(withResumeState({ foo_section: 'foo/bar', lastSection: 'bar_section' }))
      const sectionProgress: Progress = {}

      const resumeUrl = controller.getResumeUrl(req, sectionProgress)

      expect(resumeUrl).toEqual('foo/bar')
    })

    it('returns null when there is no history for the given section', () => {
      const req = buildRequestWith({ url: '/foo', sectionName: 'bar_section' })
      sessionModel.get.mockImplementation(withResumeState({ foo_section: '/foo/bar' }))
      const sectionProgress: Progress = {}

      const resumeUrl = controller.getResumeUrl(req, sectionProgress)

      expect(resumeUrl).toEqual(null)
    })

    it('returns a resume URL when there is no history for the given completed section', () => {
      const req = buildRequestWith({ url: '/foo', sectionName: 'bar_section', action: 'resume' })
      sessionModel.get.mockImplementation(withResumeState({ foo_section: '/foo/bar' }))
      const sectionProgress: Progress = { bar_section: true }

      const resumeUrl = controller.getResumeUrl(req, sectionProgress)

      expect(resumeUrl).toEqual('bar_section-page-2')
    })
  })
})
