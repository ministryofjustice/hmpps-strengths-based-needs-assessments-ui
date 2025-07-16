import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import config from '../../server/config'
import { createNavigation, createSectionProgressRules, isInEditMode } from '../utils/formRouterBuilder'
import StrengthsBasedNeedsAssessmentsApiService, {
  AssessmentResponse,
  SessionData,
} from '../../server/services/strengthsBasedNeedsService'
import { FieldType } from '../../server/@types/hmpo-form-wizard/enums'
import { validateCollectionField } from '../utils/validation'
import { combineDateFields, withStateAwareTransform } from '../utils/field.utils'
import FieldsFactory from '../form/v1_0/fields/common/fieldsFactory'
import { defaultName } from '../../server/utils/azureAppInsights'
import ForbiddenError from '../../server/errors/forbiddenError'

class BaseController extends FormWizard.Controller {
  protected apiService: StrengthsBasedNeedsAssessmentsApiService

  constructor(options: unknown) {
    super(options)

    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  async fetchAssessment(req: FormWizard.Request, sessionData: SessionData): Promise<AssessmentResponse> {
    const isViewOnly = !isInEditMode(sessionData.user, req)

    const forbiddenWhen = [
      isViewOnly && req.method !== 'GET',
      isViewOnly && req.params.mode !== 'view',
      req.params.mode === 'edit' && req.params.uuid !== sessionData.assessmentId,
    ]

    if (forbiddenWhen.some(isForbidden => isForbidden)) {
      throw new ForbiddenError(req)
    }

    const assessment =
      req.params.mode === 'edit'
        ? await this.apiService.fetchAssessment(req.params.uuid)
        : await this.apiService.fetchAssessmentVersion(req.params.uuid)

    if (req.params.mode === 'view' && assessment.metaData.uuid !== sessionData.assessmentId) {
      throw new ForbiddenError(req)
    }

    return assessment
  }

  async configure(req: FormWizard.Request, res: Response, next: NextFunction) {
    const { fields, section, steps } = req.form.options
    const sessionData = req.session.sessionData as SessionData

    res.locals.form = {
      fields: Object.keys(fields)?.filter(fieldCode => !fields[fieldCode]?.dependent?.displayInline),
      navigation: createNavigation(
        req.baseUrl,
        steps as unknown as FormWizard.Steps,
        section,
        isInEditMode(sessionData.user, req),
      ),
      sectionProgressRules: createSectionProgressRules(steps as unknown as FormWizard.Steps),
    }

    res.locals.domain = config.domain
    res.locals.oasysUrl = config.oasysUrl
    res.locals.feedbackUrl = config.feedbackUrl
    res.locals.applicationInsightsConnectionString = config.apis.appInsights.connectionString
    res.locals.applicationInsightsRoleName = defaultName()

    return super.configure(req, res, next)
  }

  getUserSubmittedFieldValue(req: FormWizard.Request, fieldCode: string): string {
    return req.form.values[fieldCode] ? (req.form.values[fieldCode] as string) : 'NO'
  }

  async process(req: FormWizard.Request, res: Response, next: NextFunction) {
    const fieldsWithStateAwareTransforms = Object.values(req.form.options.fields).map(
      withStateAwareTransform(req.session, req.form.persistedAnswers),
    )

    req.form.options.fields = Object.keys(req.form.options.fields).reduce(
      (acc, key, i) => ({
        ...acc,
        [key]: fieldsWithStateAwareTransforms[i],
      }),
      {},
    )

    req.form.values = combineDateFields(req.body, req.form.values)

    const userSubmittedField = FieldsFactory.getUserSubmittedField(Object.keys(req.form.options.fields))
    req.form.values = {
      ...req.form.values,
      [userSubmittedField]: this.getUserSubmittedFieldValue(req, userSubmittedField),
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

  async validateFields(req: FormWizard.Request, res: Response, callback: FormWizard.ValidateFieldsCallback) {
    const additionalErrors = this.validateCollectionFields(req)

    return super.validateFields(req, res, (errors: FormWizard.Controller.Errors) => {
      return callback({ ...errors, ...additionalErrors })
    })
  }

  validateCollectionFields(req: FormWizard.Request): FormWizard.Controller.Errors {
    return Object.fromEntries(
      Object.values(req.form.options.fields)
        .filter(it => it.type === FieldType.Collection)
        .map(it => validateCollectionField(it, req.form.persistedAnswers[it.code] as FormWizard.CollectionEntry[]))
        .filter(it => it !== null)
        .map(error => [error.key, error]),
    )
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    const sessionData = req.session.sessionData as SessionData
    res.locals = {
      ...res.locals,
      isInEditMode: isInEditMode(sessionData.user, req),
    }
    await super.locals(req, res, next)
  }
}

export default BaseController
