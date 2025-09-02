import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import BaseController from './baseController'
import { buildRequestBody, flattenAnswers } from './saveAndContinue.utils'
import { SessionData, userDetailsFromSession } from '../../server/services/strengthsBasedNeedsService'
import { HandoverSubject } from '../../server/services/arnsHandoverService'
import {
  addAriaRequiredAttributeToRequiredFields,
  compileConditionalFields,
  fieldsById,
  withPlaceholdersFrom,
  withStateAwareTransform,
  withValuesFrom,
} from '../utils/field.utils'
import { Gender } from '../../server/@types/hmpo-form-wizard/enums'
import { FieldDependencyTreeBuilder } from '../utils/fieldDependencyTreeBuilder'
import sectionConfig from '../form/v1_0/config/sections'
import { sendTelemetryEventForValidationError } from '../../server/services/telemetryService'

import { isInEditMode } from '../utils/formRouterBuilder'

export type Progress = Record<string, boolean>
export type SectionCompleteRule = { sectionName: string; fieldCodes: Array<string> }

class SaveAndContinueController extends BaseController {
  async configure(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionData
      const assessment = await this.fetchAssessment(req)

      res.locals.user = { ...res.locals.user, ...sessionData.user, username: sessionData.user.displayName }
      req.form.persistedAnswers = flattenAnswers(assessment.assessment)

      const withFieldIds = (others: FormWizard.Fields, [key, field]: [string, FormWizard.Field]) => ({
        ...others,
        [key]: { ...field, id: key },
      })

      req.form.options.fields = Object.entries(req.form.options.fields).reduce(withFieldIds, {})
      req.form.options.allFields = Object.entries(req.form.options.allFields).reduce(withFieldIds, {})

      if (req.method === 'GET' && isInEditMode(sessionData.user, req)) {
        const pageNavigation = new FieldDependencyTreeBuilder(
          req.form.options,
          req.form.persistedAnswers,
        ).getPageNavigation()

        const getBackLinkFromTrail = (currentStep: string, stepsTaken: string[]) => {
          const currentStepIndex = stepsTaken.indexOf(currentStep)

          return currentStepIndex > 0 ? stepsTaken[currentStepIndex - 1] : null
        }

        res.locals.generatedBackLink = getBackLinkFromTrail(req.url.slice(1), pageNavigation.stepsTaken)

        if (req.query.action === 'resume') {
          const currentPageToComplete = pageNavigation.url
          if (req.url !== `/${currentPageToComplete}`) {
            return res.redirect(currentPageToComplete)
          }
        }
      }

      req.telemetry = {
        assessmentId: sessionData.assessmentId,
        assessmentVersion: assessment.metaData.versionNumber,
        user: sessionData.user.identifier,
        section: req.form.options.section,
        handoverSessionId: sessionData.handoverSessionId,
        formVersion: req.form.options.name,
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

  calculateUnitsForGender(gender: Gender): number {
    return gender === Gender.Male ? 8 : 6
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const subjectDetails = req.session.subjectDetails as HandoverSubject
      const sessionData = req.session.sessionData as SessionData
      const answers: FormWizard.Answers = req.form.persistedAnswers

      res.locals = {
        ...res.locals,
        ...req.form.options.locals,
        answers,
        values: answers,
        placeholderValues: {
          subject: subjectDetails.givenName,
          alcohol_units: this.calculateUnitsForGender(req.session.subjectDetails.gender),
        },
        sessionData,
        subjectDetails,
        form: {
          ...res.locals.form,
          section: req.form.options.section,
          steps: req.form.options.steps,
          sectionConfig,
        },
        coreTelemetryData: req.telemetry,
      }

      const fieldsWithMappedAnswers = Object.values(req.form.options.allFields).map(withValuesFrom(answers))
      const fieldsWithReplacements = fieldsWithMappedAnswers.map(
        withPlaceholdersFrom(res.locals.placeholderValues || {}),
      )
      const fieldsWithRequiredAttributes = fieldsWithReplacements.map(addAriaRequiredAttributeToRequiredFields())

      const fieldsWithStateAwareTransform = fieldsWithRequiredAttributes.map(
        withStateAwareTransform(req.session, answers),
      )
      const fieldsWithRenderedConditionals = compileConditionalFields(fieldsWithStateAwareTransform, {
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

  // checks whether each section in the asssessment has been completed yet
  checkProgress(answers: FormWizard.Answers) {
    return function fn(progress: Progress, rule: SectionCompleteRule): Progress {
      const updatedProgress = { ...progress }
      let allFieldsComplete = true

      for (const code of rule.fieldCodes) {
        if (answers[code] !== 'YES') {
          allFieldsComplete = false
          break
        }
      }

      updatedProgress[rule.sectionName] = allFieldsComplete
      return updatedProgress
    }
  }

  getAssessmentProgress(formAnswers: FormWizard.Answers, sectionCompleteRules: SectionCompleteRule[]): Progress {
    return sectionCompleteRules.reduce(this.checkProgress(formAnswers), {})
  }

  checkAssessmentComplete(progress: Progress): boolean {
    return !Object.values(progress).includes(false)
  }

  async getValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sectionProgress = this.getAssessmentProgress(
        req.form.persistedAnswers,
        res.locals.form.sectionProgressRules,
      )
      res.locals.sectionProgress = sectionProgress
      res.locals.assessmentIsComplete = this.checkAssessmentComplete(sectionProgress)

      return super.getValues(req, res, next)
    } catch (error) {
      return next(error)
    }
  }

  getSectionProgressAnswers(req: FormWizard.Request, isSectionComplete: boolean): FormWizard.Answers {
    const sectionProgressFields: FormWizard.Answers = Object.fromEntries(
      req.form.options.sectionProgressRules?.map(({ fieldCode, conditionFn }) => [
        fieldCode,
        conditionFn(isSectionComplete, req.form.values) ? 'YES' : 'NO',
      ]),
    )

    return {
      ...sectionProgressFields,
    }
  }

  getAssessmentCompletionAnswers(progress: Progress): FormWizard.Answers {
    return {
      assessment_complete: this.checkAssessmentComplete(progress) ? 'YES' : 'NO',
    }
  }

  async persistAnswers(req: FormWizard.Request, res: Response, options: { removeOrphanAnswers?: boolean } = {}) {
    const { assessmentId } = req.session.sessionData as SessionData

    const { isSectionComplete } = new FieldDependencyTreeBuilder(req.form.options, {
      ...req.form.persistedAnswers,
      ...req.form.values,
    }).getPageNavigation()

    const sectionCompleteAnswers = this.getSectionProgressAnswers(req, isSectionComplete)

    const combinedAnswers: FormWizard.Answers = {
      ...req.form.persistedAnswers,
      ...(req.form.values || {}),
      ...sectionCompleteAnswers,
    }

    const answersToPersist = {
      ...combinedAnswers,
      ...this.getAssessmentCompletionAnswers(
        this.getAssessmentProgress(combinedAnswers, res.locals.form.sectionProgressRules),
      ),
    }

    const { answersToAdd, answersToRemove } = buildRequestBody(req.form.options, answersToPersist, options)

    // remove answers from the session model
    // because FormWizard uses it for page routing logic
    answersToRemove.forEach(fieldCode => {
      req.sessionModel.set(fieldCode, null)
    })

    req.form.values = {
      ...answersToPersist,
      ...answersToRemove.reduce(
        (removedAnswers: Record<string, string>, fieldCode: string): Record<string, string> => ({
          ...removedAnswers,
          [fieldCode]: null,
        }),
        {},
      ),
    }
    res.locals.values = req.form.values

    await this.apiService.updateAnswers(assessmentId, {
      answersToAdd,
      answersToRemove,
      userDetails: userDetailsFromSession(req.session.sessionData as SessionData),
    })
  }

  async successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    let answersPersisted = false
    const jsonResponse = req.query.jsonResponse === 'true'

    try {
      await this.persistAnswers(req, res, { removeOrphanAnswers: !jsonResponse })
      answersPersisted = true

      if (jsonResponse) {
        return res.json({ answersPersisted })
      }

      return super.successHandler(req, res, next)
    } catch (error) {
      if (jsonResponse) {
        return res.json({ answersPersisted })
      }

      return next(error)
    }
  }

  async errorHandler(err: Error, req: FormWizard.Request, res: Response, next: NextFunction) {
    let answersPersisted = false
    const jsonResponse = req.query.jsonResponse === 'true'

    try {
      if (this.isValidationError(err)) {
        await this.persistAnswers(req, res, { removeOrphanAnswers: false })
        answersPersisted = true
        sendTelemetryEventForValidationError(
          err as unknown as FormWizard.Controller.Errors,
          jsonResponse,
          req.telemetry,
        )
        this.setErrors(err, req, res)
      }

      if (jsonResponse) {
        return res.json({ answersPersisted })
      }

      return super.errorHandler(err, req, res, next)
    } catch (error) {
      if (jsonResponse) {
        return res.json({ answersPersisted })
      }

      return next(error)
    }
  }
}

export default SaveAndContinueController
