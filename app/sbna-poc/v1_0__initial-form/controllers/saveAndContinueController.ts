import { Response, NextFunction } from 'express'
import FormWizard from 'hmpo-form-wizard'
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
    '/drug-use-analysis',
    '/no-drug-use-summary',
    '/finance-summary-analysis',
    '/alcohol-usage-last-three-months-analysis',
    '/alcohol-usage-but-not-last-three-months-analysis',
    '/alcohol-no-usage-analysis',
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
      const answerDtos = await this.apiService.fetchAnswers(sessionData.assessmentUUID)
      req.form.persistedAnswers = flattenAnswers(answerDtos)

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async addAssessmentDataToLocals(req: FormWizard.Request, res: Response) {
    const sessionData = req.session.sessionData as SessionInformation
    res.locals.sessionData = sessionData
    res.locals.subjectDetails = req.session.subjectDetails as SubjectResponse
    res.locals.assessmentId = sessionData.assessmentUUID
    res.locals.placeholderValues = { subject: res.locals.subjectDetails.givenName, alcohol_units: 8 } // TODO: Hardcoded alcohol units for now, will need to calculate this based on gender
    res.locals.values = mergeAnswers(req.form.persistedAnswers, res.locals.values)
  }

  updateAssessmentProgress(req: FormWizard.Request, res: Response) {
    type Progress = Record<string, boolean>
    type SectionCompleteRule = { sectionName: string; fieldCodes: Array<string> }
    type AnswerValues = Record<string, string>

    const subsectionIsComplete =
      (answers: AnswerValues = {}) =>
      (fieldCode: string) =>
        answers[fieldCode] === 'YES'
    const checkProgress =
      (answers: AnswerValues) =>
      (sectionProgress: Progress, { sectionName, fieldCodes }: SectionCompleteRule): Progress => ({
        ...sectionProgress,
        [sectionName]: fieldCodes.every(subsectionIsComplete(answers)),
      })

    const sections = res.locals.form.sectionProgressRules
    const sectionProgress: Progress = sections.reduce(
      checkProgress(req.form.persistedAnswers as Record<string, string>),
      {},
    )
    res.locals.sectionProgress = sectionProgress
    res.locals.assessmentIsComplete = !Object.values(sectionProgress).includes(false)
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      await this.addAssessmentDataToLocals(req, res)
      this.updateAssessmentProgress(req, res)

      res.locals.isSaved = req.sessionModel.get('isSaved') || false
      req.sessionModel.set('isSaved', false)

      super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  getResumeUrl(req: FormWizard.Request): ResumeUrl {
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
    return super.process(req, res, next)
  }

  async getValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    const resumeUrl = this.getResumeUrl(req)

    return resumeUrl ? res.redirect(resumeUrl) : super.getValues(req, res, next)
  }

  setSectionProgress(req: FormWizard.Request, isValidated: boolean) {
    const sectionProgressRules = req.form.options.sectionProgressRules || []

    req.form.values = sectionProgressRules.reduce(
      (answers, { fieldCode, conditionFn }) => ({ ...answers, [fieldCode]: conditionFn(isValidated, req.form.values) }),
      req.form.values || {},
    )
  }

  resetResumeUrl(req: FormWizard.Request) {
    const sectionName = req.form.options.section
    const resumeState = (req.sessionModel.get('resumeState') as Record<string, ResumeUrl>) || {}
    req.sessionModel.set('resumeState', { ...resumeState, [sectionName]: null })
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    return super.saveValues(req, res, next)
  }

  async persistAnswers(req: FormWizard.Request, res: Response, tags: string[]) {
    const { assessmentUUID } = req.session.sessionData as SessionInformation

    const answers = { ...req.form.persistedAnswers, ...req.form.values }
    const { answersToAdd, answersToRemove } = buildRequestBody(
      req.form.options.fields,
      req.form.options.allFields,
      answers,
    )

    const updatedAnswers = {
      ...answers,
      ...answersToRemove.reduce((removedAnswers, fieldCode) => ({ ...removedAnswers, [fieldCode]: null }), {}),
    }

    req.form.values = updatedAnswers
    res.locals.values = req.form.values

    await this.apiService.updateAnswers(assessmentUUID, { answersToAdd, answersToRemove, tags })
  }

  async successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    this.setSectionProgress(req, true)
    await this.persistAnswers(req, res, ['validated', 'unvalidated'])

    if (req.query.jsonResponse === 'true') {
      return res.send('👍')
    }

    this.resetResumeUrl(req)

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
    if (req.query.jsonResponse === 'true') {
      return res.send('👍')
    }

    this.resetResumeUrl(req)

    if (Object.values(error).every(thisError => thisError instanceof FormWizard.Controller.Error)) {
      this.setSectionProgress(req, false)
      await this.persistAnswers(req, res, ['unvalidated'])

      this.setErrors(error, req, res)
    }

    return super.errorHandler(error, req, res, next)
  }
}

export default SaveAndContinueController
