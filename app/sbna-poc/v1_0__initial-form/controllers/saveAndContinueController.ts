import { Response, NextFunction } from 'express'
import FormWizard, { FieldType } from 'hmpo-form-wizard'
import BaseSaveAndContinueController from '../../../common/controllers/saveAndContinue'
import StrengthsBasedNeedsAssessmentsApiService, {
  SessionInformation,
  SubjectResponse,
} from '../../../../server/services/strengthsBasedNeedsService'
import { buildRequestBody, mergeAnswers } from './saveAndContinueController.utils'

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

      super.configure(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async locals(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const sessionData = req.session.sessionData as SessionInformation
      res.locals.sessionData = sessionData
      res.locals.subjectDetails = req.session.subjectDetails as SubjectResponse
      res.locals.placeholderValues = { subject: res.locals.subjectDetails.givenName }

      const savedAnswers = await this.apiService.fetchAnswers(sessionData.assessmentUUID)
      const submittedAnswers = res.locals.values
      res.locals.values = mergeAnswers(savedAnswers, submittedAnswers)

      res.locals.collections = Object.entries(savedAnswers)
        .filter(([_, answer]) => answer.type === FieldType.Collection)
        .reduce((rest, [field, answer]) => ({ ...rest, [field]: answer.collection }), {})

      super.locals(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async getValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    const isResume = req.query.action === 'resume'
    const thisSection = req.form.options.section
    const resumeState = (req.sessionModel.get('resumeState') as Record<string, string | null>) || {}
    const lastPage = resumeState[thisSection]
    const { lastSection } = resumeState

    if (lastPage && (thisSection !== lastSection || isResume)) {
      req.sessionModel.set('resumeState', { ...resumeState, [thisSection]: null, lastSection: thisSection })
      return res.redirect(lastPage)
    }

    req.sessionModel.set('resumeState', { ...resumeState, [thisSection]: req.url.slice(1), lastSection: thisSection })

    return super.getValues(req, res, next)
  }

  async saveValues(req: FormWizard.Request, res: Response, next: NextFunction) {
    try {
      const { assessmentUUID } = req.session.sessionData as SessionInformation

      const savedAnswers = await this.apiService.fetchAnswers(assessmentUUID)
      const submittedAnswers = req.form.values
      const allAnswers = mergeAnswers(savedAnswers, submittedAnswers)

      const { answersToAdd, answersToRemove } = buildRequestBody(
        req.form.options.allFields,
        submittedAnswers,
        allAnswers,
      )

      req.form.values = {
        ...req.form.values,
        ...answersToRemove.reduce((acc, fieldCode) => ({ ...acc, [fieldCode]: null }), {}),
      }

      await this.apiService.updateAnswers(assessmentUUID, { answersToAdd, answersToRemove })

      const thisSection = req.form.options.section
      const resumeState = (req.sessionModel.get('resumeState') as Record<string, string | null>) || {}
      req.sessionModel.set('resumeState', { ...resumeState, [thisSection]: null })

      super.saveValues(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  async successHandler(req: FormWizard.Request, res: Response, next: NextFunction) {
    if (req.query.action === 'addChild') {
      return res.redirect('add-living-with-child')
    }

    if (req.query.action === 'removeChild' && req.query.index) {
      const { assessmentUUID } = req.session.sessionData as SessionInformation

      await this.apiService.removeFromCollection(
        assessmentUUID,
        'living_with_children',
        Number.parseInt(req.query.index as string, 10),
      )

      return res.redirect(req.path.slice(1))
    }

    if (req.query.action === 'editChild' && req.query.index) {
      return res.redirect(`edit-living-with-child?index=${Number.parseInt(req.query.index as string, 10)}`)
    }

    if (req.query.action === 'addPartner') {
      return res.redirect('add-living-with-partner')
    }

    if (req.query.action === 'removePartner' && req.query.index) {
      const { assessmentUUID } = req.session.sessionData as SessionInformation

      await this.apiService.removeFromCollection(
        assessmentUUID,
        'living_with_partner',
        Number.parseInt(req.query.index as string, 10),
      )

      return res.redirect(req.path.slice(1))
    }

    if (req.query.action === 'editPartner' && req.query.index) {
      return res.redirect(`edit-living-with-partner?index=${Number.parseInt(req.query.index as string, 10)}`)
    }

    return super.successHandler(req, res, next)
  }
}

export default SaveAndContinueController
