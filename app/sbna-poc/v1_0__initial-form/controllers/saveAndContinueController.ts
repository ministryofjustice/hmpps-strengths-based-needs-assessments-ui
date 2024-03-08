import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseSaveAndContinueController from '../../../common/controllers/saveAndContinue'
import StrengthsBasedNeedsAssessmentsApiService, {
  SessionInformation,
  SubjectResponse,
} from '../../../../server/services/strengthsBasedNeedsService'
import { buildRequestBody, flattenAnswers, mergeAnswers } from './saveAndContinueController.utils'

type ResumeUrl = string | null
export type Progress = Record<string, boolean>

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
      const assessment = await this.apiService.fetchAssessment(sessionData.assessmentUUID)
      req.form.persistedAnswers = flattenAnswers(assessment.assessment)
      res.locals.oasysEquivalent = assessment.oasysEquivalent

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async get(req: FormWizard.Request, res: Response, next: NextFunction) {
    Object.keys(req.form.persistedAnswers).forEach(k => req.sessionModel.set(k, req.form.persistedAnswers[k]))

    return super.get(req, res, next)
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

      super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  getResumeUrl(req: FormWizard.Request, sectionProgress: Progress): ResumeUrl {
    const isResuming = req.query.action === 'resume'
    const sectionName = req.form.options.section
    const resumeState = (req.sessionModel.get('resumeState') as Record<string, ResumeUrl>) || {}
    const [lastStepOfSection] = Object.entries(req.form.options.steps)
      .reverse()
      .find(([, step]) => step.section === sectionName)
    const lastPageVisited = resumeState[sectionName] || (sectionProgress[sectionName] ? lastStepOfSection : undefined)
    const { lastSection } = resumeState

    if (lastPageVisited && (sectionName !== lastSection || isResuming)) {
      req.sessionModel.set('resumeState', { ...resumeState, [sectionName]: null, lastSection: sectionName })
      return lastPageVisited.replace(/^\//, '')
    }

    req.sessionModel.set('resumeState', { ...resumeState, [sectionName]: req.url.slice(1), lastSection: sectionName })

    return null
  }

  async getValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      this.updateAssessmentProgress(req, res)
      const resumeUrl = this.getResumeUrl(req, res.locals.sectionProgress)

      return resumeUrl ? res.redirect(resumeUrl) : super.getValues(req, res, next)
    } catch (error) {
      return next(error)
    }
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

  async persistAnswers(req: FormWizard.Request, res: Response, tags: string[]) {
    const { assessmentUUID } = req.session.sessionData as SessionInformation

    const answers = { ...req.form.persistedAnswers, ...req.form.values }
    const { answersToAdd, answersToRemove } = buildRequestBody(
      req.form.options.fields,
      req.form.options.allFields,
      answers,
    )

    req.form.values = {
      ...answers,
      ...answersToRemove.reduce((removedAnswers, fieldCode) => ({ ...removedAnswers, [fieldCode]: null }), {}),
    }
    res.locals.values = req.form.values

    await this.apiService.updateAnswers(assessmentUUID, { answersToAdd, answersToRemove, tags })
  }

  async successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      this.setSectionProgress(req, true)
      await this.persistAnswers(req, res, ['VALIDATED', 'UNVALIDATED'])

      if (req.query.jsonResponse === 'true') {
        return res.send('👍')
      }

      this.resetResumeUrl(req)

      return super.successHandler(req, res, next)
    } catch (error) {
      return next(error)
    }
  }

  async errorHandler(err: Error, req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      if (req.query.jsonResponse === 'true') {
        return res.send('👍')
      }

      this.resetResumeUrl(req)

      if (Object.values(err).every(thisError => thisError instanceof FormWizard.Controller.Error)) {
        this.setSectionProgress(req, false)
        await this.persistAnswers(req, res, ['UNVALIDATED'])

        this.setErrors(err, req, res)
      }

      return super.errorHandler(err, req, res, next)
    } catch (error) {
      return next(error)
    }
  }
}

export default SaveAndContinueController
