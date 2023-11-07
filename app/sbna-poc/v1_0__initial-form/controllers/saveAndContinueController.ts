import { Response, NextFunction } from 'express'
import FormWizard, { FieldType } from 'hmpo-form-wizard'
import BaseSaveAndContinueController from '../../../common/controllers/saveAndContinue'
import StrengthsBasedNeedsAssessmentsApiService, {
  SessionInformation,
  SubjectResponse,
} from '../../../../server/services/strengthsBasedNeedsService'
import { buildRequestBody, flattenAnswers, mergeAnswers } from './saveAndContinueController.utils'

type ResumeUrl = string | null

const isPractitionerAnalysisPage = (url: string) =>
  [
    '/accommodation-summary-analysis-settled',
    '/accommodation-summary-analysis-temporary',
    '/accommodation-summary-analysis-no-accommodation',
    '/no-drug-use-summary',
    // TODO: Add for finance
  ].includes(url)

class SaveAndContinueController extends BaseSaveAndContinueController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  async configure(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionInformation
      res.locals.user = { username: sessionData.userDisplayName }
      await this.apiService.validateSession(sessionData.uuid)
      req.form.persistedAnswers = await this.apiService.fetchAnswers(sessionData.assessmentUUID)
      req.form.submittedAnswers = flattenAnswers(req.form.persistedAnswers)

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async fetchAnswers(req: FormWizard.Request, res: Response) {
    const sessionData = req.session.sessionData as SessionInformation
    res.locals.sessionData = sessionData
    res.locals.subjectDetails = req.session.subjectDetails as SubjectResponse
    res.locals.placeholderValues = { subject: res.locals.subjectDetails.givenName }

    const savedAnswers = await this.apiService.fetchAnswers(sessionData.assessmentUUID)
    const submittedAnswers = res.locals.values
    res.locals.values = mergeAnswers(savedAnswers, submittedAnswers)

    res.locals.collections = Object.entries(savedAnswers)
      .filter(([_, answer]) => answer.type === FieldType.Collection)
      .reduce((rest, [fieldCode, answer]) => ({ ...rest, [fieldCode]: answer.collection }), {})
  }

  updateAssessmentProgress(res: Response) {
    type Progress = Record<string, boolean>
    type SectionCompleteRule = { sectionName: string; fieldCodes: Array<string> }
    type AnswerValues = Record<string, string>

    const isComplete = (answers: AnswerValues) => (fieldCode: string) => answers[fieldCode] === 'YES'
    const checkProgress =
      (answers: AnswerValues) =>
      (assessmentProgress: Progress, { sectionName, fieldCodes }: SectionCompleteRule) => ({
        ...assessmentProgress,
        [sectionName]: fieldCodes.every(isComplete(answers)),
      })
    const sections: Array<SectionCompleteRule> = [
      {
        sectionName: 'accommodation',
        fieldCodes: ['accommodation_section_complete', 'accommodation_analysis_section_complete'],
      },
      { sectionName: 'employment-education-finance', fieldCodes: [] },
      { sectionName: 'drug-use', fieldCodes: ['drug_use_section_complete', 'drug_use_analysis_section_complete'] },
      { sectionName: 'finance', fieldCodes: ['finance_section_complete', 'finance_analysis_section_complete'] },
    ]

    res.locals.assessmentProgress = sections.reduce(checkProgress(res.locals.values), {})
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      await this.fetchAnswers(req, res)
      this.updateAssessmentProgress(res)

      res.locals.isSaved = req.sessionModel.get('isSaved') || false
      req.sessionModel.set('isSaved', false)

      super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async getResumeUrl(req: FormWizard.Request): Promise<ResumeUrl> {
    const isResuming = req.query.action === 'resume'
    const sectionName = req.form.options.section
    const resumeState = (req.sessionModel.get('resumeState') as Record<string, ResumeUrl>) || {}
    const lastPageVisited = resumeState[sectionName]
    const { lastSection } = resumeState

    if (lastPageVisited && (sectionName !== lastSection || isResuming)) {
      req.sessionModel.set('resumeState', { ...resumeState, [sectionName]: null, lastSection: sectionName })
      return lastPageVisited
    }

    req.sessionModel.set('resumeState', { ...resumeState, [sectionName]: req.url.slice(1), lastSection: sectionName })

    return null
  }

  async process(req: FormWizard.Request, res: Response, next: NextFunction) {
    if (req.query.action === 'saveDraft') {
      const { fields } = req.form.options

      req.form.options.fields = Object.entries(fields).reduce(
        (modifiedFields, [fieldCode, fieldConfig]) => ({
          ...modifiedFields,
          [fieldCode]: { ...fieldConfig, validate: [] },
        }),
        { ...fields },
      )
    }

    super.process(req, res, next)
  }

  async getValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    const resumeUrl = await this.getResumeUrl(req)

    return resumeUrl ? res.redirect(resumeUrl) : super.getValues(req, res, next)
  }

  setSectionProgress(req: FormWizard.Request) {
    const sectionProgressRules = req.form.options.sectionProgressRules || []
    const isValidated = req.query.action !== 'saveDraft'

    req.form.submittedAnswers = sectionProgressRules.reduce(
      (answers, { fieldCode, conditionFn }) => ({ ...answers, [fieldCode]: conditionFn(isValidated, req.form.values) }),
      req.form.submittedAnswers || {},
    )
  }

  async saveAnswers(req: FormWizard.Request) {
    const { assessmentUUID } = req.session.sessionData as SessionInformation

    const answers = { ...flattenAnswers(req.form.persistedAnswers), ...req.form.submittedAnswers }
    const { answersToAdd, answersToRemove } = buildRequestBody(
      req.form.options.fields,
      req.form.options.allFields,
      answers,
    )

    req.form.values = {
      ...answers,
      ...answersToRemove.reduce((removedAnswers, fieldCode) => ({ ...removedAnswers, [fieldCode]: null }), {}),
    }

    await this.apiService.updateAnswers(assessmentUUID, { answersToAdd, answersToRemove })
  }

  setResumeUrl(req: FormWizard.Request) {
    const sectionName = req.form.options.section
    const resumeState = (req.sessionModel.get('resumeState') as Record<string, ResumeUrl>) || {}
    req.sessionModel.set('resumeState', { ...resumeState, [sectionName]: null })
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      this.setSectionProgress(req)
      await this.saveAnswers(req)
      this.setResumeUrl(req)

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    if (req.query.action === 'saveDraft') {
      const redirectUrl = req.baseUrl + req.path

      req.sessionModel.set('isSaved', true)

      return isPractitionerAnalysisPage(req.path)
        ? res.redirect(`${redirectUrl}#practitioner-analysis`)
        : res.redirect(redirectUrl)
    }

    return super.successHandler(req, res, next)
  }

  async errorHandler(error: Error, req: FormWizard.Request, res: Response, next: NextFunction) {
    if (
      Object.values(error).every(e => e instanceof FormWizard.Controller.Error) &&
      isPractitionerAnalysisPage(req.path)
    ) {
      this.setErrors(error, req, res)
      return res.redirect(`${req.baseUrl + req.path}#practitioner-analysis`)
    }

    return super.errorHandler(error, req, res, next)
  }
}

export default SaveAndContinueController
