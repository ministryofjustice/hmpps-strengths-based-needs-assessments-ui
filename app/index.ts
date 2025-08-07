import { type Response, NextFunction, Router } from 'express'
import FormWizard from 'hmpo-form-wizard'
import { HTTPError } from 'superagent'
import FormRouterBuilder, { FormWizardRouter } from './utils/formRouterBuilder'
import V1_0 from './form/v1_0'
import StrengthsBasedNeedsAssessmentsApiService from '../server/services/strengthsBasedNeedsService'
import { assessmentOrForbidden } from './utils/assessmentOrForbidden'

interface FormWizardError extends HTTPError {
  redirect?: string
}

export default class App {
  protected apiService: StrengthsBasedNeedsAssessmentsApiService

  formRouters: Record<string, FormWizardRouter>

  formConfigRouter: Router

  static errorHandler(error: FormWizardError, req: FormWizard.Request, res: Response, next: NextFunction) {
    if (error.redirect) return res.redirect(error.redirect)
    return next(error)
  }

  constructor() {
    const formRouterBuilder = FormRouterBuilder.configure(V1_0)
    this.formRouters = formRouterBuilder.formRouters
    this.formConfigRouter = formRouterBuilder.formConfigRouter
    this.apiService = new StrengthsBasedNeedsAssessmentsApiService()
  }

  getFormWizardRouter() {
    return async (req: FormWizard.Request, res: Response, next: NextFunction) => {
      const assessment = await assessmentOrForbidden(req, this.apiService)

      res.locals = { ...res.locals, assessment }

      if (!this.formRouters[assessment.metaData.formVersion]) {
        throw new Error(`Form Router not found for version ${assessment.metaData.formVersion}`)
      }

      return this.formRouters[assessment.metaData.formVersion].router(req, res, next)
    }
  }
}
