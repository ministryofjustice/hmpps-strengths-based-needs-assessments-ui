import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from './baseController'
import { createAnswerDTOs, flattenAnswers, isReadOnly } from './saveAndContinue.utils'
import StrengthsBasedNeedsAssessmentsApiService, { SessionData } from '../../server/services/strengthsBasedNeedsService'
import { HandoverSubject } from '../../server/services/arnsHandoverService'
import {
  combineDateFields,
  compileConditionalFields,
  fieldsById,
  withPlaceholdersFrom,
  withValuesFrom,
} from '../utils/field.utils'
import { FieldType } from '../../server/@types/hmpo-form-wizard/enums'
import { NavigationItem } from '../utils/formRouterBuilder'
import { isInEditMode } from '../../server/utils/nunjucks.utils'
import { FieldDependencyTreeBuilder } from '../utils/fieldDependencyTreeBuilder'
import FieldsFactory from '../form/v1_0/fields/common/fieldsFactory'
import { Progress } from './saveAndContinueController'

abstract class BaseCollectionController extends BaseController {
  static noCollectionAnswers = (field: FormWizard.Field) => {
    if (field.type !== FieldType.Collection) {
      throw new Error(`Field ${field.code} is not of type Collection`)
    }
    return (req: FormWizard.Request) => (req.form.persistedAnswers[field.code] || []).length === 0
  }

  private apiService: StrengthsBasedNeedsAssessmentsApiService

  abstract readonly field: FormWizard.Field

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  buildRequestBody(req: FormWizard.Request, res: Response) {
    const fields = this.field.collection.fields || []
    const answerPairs = fields.map(it => [it.code, req.form.values[it.code]])
    const collectionEntry: FormWizard.CollectionEntry = Object.fromEntries(answerPairs)

    const persistedCollection = (req.form.persistedAnswers[this.field.code] || []) as FormWizard.CollectionEntry[]

    persistedCollection.push(collectionEntry)

    const otherFields = Object.values(req.form.options.fields)
      .filter(it => fields.find(f => f.code === it.code) === undefined)
      .reduce(createAnswerDTOs(req.form.values), {})

    const collection = [this.field].reduce(createAnswerDTOs({ [this.field.code]: persistedCollection }), {})

    return { ...otherFields, ...collection }
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

      if (req.method === 'GET' && req.query.action === 'resume') {
        const currentPageToComplete = new FieldDependencyTreeBuilder(
          req.form.options,
          req.form.persistedAnswers,
        ).getNextPageToComplete().url
        if (req.url !== `/${currentPageToComplete}`) {
          return res.redirect(currentPageToComplete)
        }
      }

      return await super.configure(req, res, next)
    } catch (error) {
      return next(error)
    }
  }

  async get(req: FormWizard.Request, res: Response, next: NextFunction) {
    Object.keys(req.form.persistedAnswers).forEach(k => req.sessionModel.set(k, req.form.persistedAnswers[k]))

    if (!Object.keys(req.sessionModel.get('errors') || {}).some(field => req.form.options.fields[field])) {
      req.sessionModel.set('errors', null)
      req.sessionModel.set('errorValues', null)
    }

    return super.get(req, res, next)
  }

  async process(req: FormWizard.Request, res: Response, next: NextFunction) {
    req.form.values = combineDateFields(req.body, req.form.values)

    const userSubmittedField = FieldsFactory.getUserSubmittedField(Object.keys(req.form.options.fields))
    if (!req.form.values[userSubmittedField]) {
      req.form.values = {
        ...req.form.values,
        [userSubmittedField]: 'NO',
      }
    }

    const mergedAnswers = { ...req.form.persistedAnswers, ...req.form.values }

    req.form.values = Object.entries(req.form.options.fields)
      .filter(([_, field]) => {
        const dependentValue = mergedAnswers[field.dependent?.field]
        return (
          !field.dependent ||
          (Array.isArray(dependentValue)
            ? (dependentValue as string[]).includes(field.dependent.value)
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

      return super.getValues(req, res, next)
    } catch (error) {
      return next(error)
    }
  }

  getSectionProgress(req: FormWizard.Request, isSectionComplete: boolean): FormWizard.Answers {
    const sectionProgressFields: FormWizard.Answers = Object.fromEntries(
      req.form.options.sectionProgressRules?.map(({ fieldCode, conditionFn }) => [
        fieldCode,
        conditionFn(isSectionComplete, req.form.values) ? 'YES' : 'NO',
      ]),
    )

    return {
      ...sectionProgressFields,
      assessment_complete: Object.values(sectionProgressFields).every(answer => answer === 'YES') ? 'YES' : 'NO',
    }
  }

  async persistAnswers(req: FormWizard.Request, res: Response) {
    const { assessmentId } = req.session.sessionData as SessionData
    const answersToAdd = this.buildRequestBody(req, res)

    await this.apiService.updateAnswers(assessmentId, { answersToAdd, answersToRemove: [] })
  }

  async successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    let answersPersisted = false

    try {
      await this.persistAnswers(req, res)
      answersPersisted = true

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
      if (Object.values(err).every(thisError => thisError instanceof FormWizard.Controller.Error)) {
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

export default BaseCollectionController
