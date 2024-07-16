import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from './baseController'
import { buildRequestBody, flattenAnswers, isReadOnly } from './saveAndContinue.utils'
import StrengthsBasedNeedsAssessmentsApiService, { SessionData } from '../../server/services/strengthsBasedNeedsService'
import { HandoverSubject } from '../../server/services/arnsHandoverService'
import {
  combineDateFields,
  compileConditionalFields,
  fieldsById,
  withPlaceholdersFrom,
  withValuesFrom,
} from '../utils/field.utils'
import { Gender } from '../../server/@types/hmpo-form-wizard/enums'
import { NavigationItem } from '../utils/formRouterBuilder'
import { isInEditMode } from '../../server/utils/nunjucks.utils'

type ResumeUrl = string | null
export type Progress = Record<string, boolean>

class SaveAndContinueController extends BaseController {
  apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  async configure(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionData

      if (!isInEditMode(sessionData.user) && req.method !== 'GET') {
        return res.status(401).send('Cannot edit whilst in read-only mode')
      }

      res.locals.user = { ...res.locals.user, ...sessionData.user, username: sessionData.user.displayName }

      const assessment = isInEditMode(sessionData.user)
        ? await this.apiService.fetchAssessment(sessionData.assessmentId)
        : await this.apiService.fetchAssessment(sessionData.assessmentId, sessionData.assessmentVersion)

      req.form.persistedAnswers = flattenAnswers(assessment.assessment)
      res.locals.oasysEquivalent = assessment.oasysEquivalent

      const withFieldIds = (others: FormWizard.Fields, [key, field]: [string, FormWizard.Field]) => ({
        ...others,
        [key]: { ...field, id: key },
      })

      req.form.options.fields = Object.entries(req.form.options.fields).reduce(withFieldIds, {})
      req.form.options.allFields = Object.entries(req.form.options.allFields).reduce(withFieldIds, {})

      return await super.configure(req, res, next)
    } catch (error) {
      return next(error)
    }
  }

  async get(req: FormWizard.Request, res: Response, next: NextFunction) {
    Object.keys(req.form.persistedAnswers).forEach(k => req.sessionModel.set(k, req.form.persistedAnswers[k]))

    return super.get(req, res, next)
  }

  async process(req: FormWizard.Request, res: Response, next: NextFunction) {
    req.form.values = combineDateFields(req.body, req.form.values)
    const mergedAnswers = { ...req.form.persistedAnswers, ...req.form.values }

    req.form.values = Object.entries(req.form.options.fields)
      .filter(([_, field]) => {
        const dependentValue = mergedAnswers[field.dependent?.field]
        return (
          !field.dependent ||
          (Array.isArray(dependentValue)
            ? dependentValue.includes(field.dependent.value)
            : dependentValue === field.dependent.value)
        )
      })
      .reduce((updatedAnswers, [key, field]) => {
        return field.id
          ? { ...updatedAnswers, [field.id]: req.form.values[key], [field.code]: req.form.values[key] }
          : { ...updatedAnswers, [field.code]: req.form.values[key] }
      }, {})

    return super.process(req, res, next)
  }

  calculateUnitsForGender(gender: Gender): number {
    return gender === Gender.Male ? 8 : 6
  }

  setReadOnlyNavigation(steps: FormWizard.RenderedSteps, navigation: Array<NavigationItem>): Array<NavigationItem> {
    return navigation.map(navigationItem => {
      const [summaryPageUrl] =
        Object.entries(steps).find(([stepUrl, stepConfig]) => {
          return stepConfig.section === navigationItem.section && stepUrl.endsWith('analysis-complete')
        }) || []

      return {
        ...navigationItem,
        url: summaryPageUrl?.slice(1) || navigationItem.url,
      }
    })
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const subjectDetails = req.session.subjectDetails as HandoverSubject
      const sessionData = req.session.sessionData as SessionData
      const navigation = isReadOnly(sessionData.user)
        ? this.setReadOnlyNavigation(req.form.options.steps, res.locals.form.navigation)
        : res.locals.form.navigation

      res.locals = {
        ...res.locals,
        ...req.form.options.locals,
        answers: req.form.persistedAnswers,
        values: req.form.persistedAnswers,
        placeholderValues: {
          subject: subjectDetails.givenName,
          alcohol_units: this.calculateUnitsForGender(req.session.subjectDetails.gender),
        },
        sessionData,
        subjectDetails,
        form: { ...res.locals.form, navigation, section: req.form.options.section, steps: req.form.options.steps },
      }

      const fieldsWithMappedAnswers = Object.values(req.form.options.allFields).map(withValuesFrom(res.locals.values))
      const fieldsWithReplacements = fieldsWithMappedAnswers.map(
        withPlaceholdersFrom(res.locals.placeholderValues || {}),
      )
      const fieldsWithRenderedConditionals = compileConditionalFields(fieldsWithReplacements, {
        action: res.locals.action,
        errors: res.locals.errors,
      })

      res.locals.options.fields = fieldsWithRenderedConditionals
        .filter(it => res.locals.form.fields.includes(it.code))
        .reduce(fieldsById, {})
      res.locals.options.allFields = fieldsWithRenderedConditionals.reduce(fieldsById, {})

      await super.locals(req, res, next)
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
      .find(([_path, step]) => step.section === sectionName)
    const lastPageVisited = resumeState[sectionName] || (sectionProgress[sectionName] ? lastStepOfSection : undefined)

    if (lastPageVisited && isResuming) {
      req.sessionModel.set('resumeState', { ...resumeState, [sectionName]: null, lastSection: sectionName })
      return lastPageVisited.replace(/^\//, '')
    }

    req.sessionModel.set('resumeState', { ...resumeState, [sectionName]: req.url.slice(1), lastSection: sectionName })

    return null
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

  async getValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      this.updateAssessmentProgress(req, res)
      if (!isReadOnly((req.session.sessionData as SessionData)?.user)) {
        const resumeUrl = this.getResumeUrl(req, res.locals.sectionProgress)
        if (resumeUrl) {
          return res.redirect(resumeUrl)
        }
      }

      return super.getValues(req, res, next)
    } catch (error) {
      return next(error)
    }
  }

  setSectionProgress(req: FormWizard.Request, isValidated: boolean) {
    const sectionProgressRules = req.form.options.sectionProgressRules || []

    req.form.values = sectionProgressRules.reduce(
      (answers, { fieldCode, conditionFn }) => ({
        ...answers,
        [fieldCode]: conditionFn(isValidated, req.form.values) ? 'YES' : 'NO',
      }),
      req.form.values || {},
    )

    req.form.values.assessment_complete = sectionProgressRules.every(rule => req.form.values[rule.fieldCode] === 'YES')
      ? 'YES'
      : 'NO'
  }

  resetResumeUrl(req: FormWizard.Request) {
    const sectionName = req.form.options.section
    const resumeState = (req.sessionModel.get('resumeState') as Record<string, ResumeUrl>) || {}
    req.sessionModel.set('resumeState', { ...resumeState, [sectionName]: null })
  }

  async persistAnswers(req: FormWizard.Request, res: Response) {
    const { assessmentId } = req.session.sessionData as SessionData

    const answers = { ...req.form.persistedAnswers, ...req.form.values }
    const { answersToAdd, answersToRemove } = buildRequestBody(req.form.options, answers)

    req.form.values = {
      ...answers,
      ...answersToRemove.reduce((removedAnswers, fieldCode) => ({ ...removedAnswers, [fieldCode]: null }), {}),
    }
    res.locals.values = req.form.values

    await this.apiService.updateAnswers(assessmentId, { answersToAdd, answersToRemove })
  }

  async successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    let answersPersisted = false

    try {
      this.setSectionProgress(req, true)
      await this.persistAnswers(req, res)
      answersPersisted = true

      this.resetResumeUrl(req)

      if (req.query.jsonResponse === 'true') {
        return res.json({ answersPersisted })
      }

      return super.successHandler(req, res, next)
    } catch (error) {
      if (req.query.jsonResponse === 'true') {
        return res.json({ answersPersisted })
      }

      return next(error)
    }
  }

  async errorHandler(err: Error, req: FormWizard.Request, res: Response, next: NextFunction) {
    let answersPersisted = false

    try {
      this.resetResumeUrl(req)

      if (Object.values(err).every(thisError => thisError instanceof FormWizard.Controller.Error)) {
        this.setSectionProgress(req, false)
        await this.persistAnswers(req, res)
        answersPersisted = true
        this.setErrors(err, req, res)
      }

      if (req.query.jsonResponse === 'true') {
        return res.json({ answersPersisted })
      }

      return super.errorHandler(err, req, res, next)
    } catch (error) {
      if (req.query.jsonResponse === 'true') {
        return res.json({ answersPersisted })
      }

      return next(error)
    }
  }
}

export default SaveAndContinueController
