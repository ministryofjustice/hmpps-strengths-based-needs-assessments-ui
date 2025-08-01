import FormWizard from 'hmpo-form-wizard'
import StrengthsBasedNeedsAssessmentsApiService, { SessionData } from '../../server/services/strengthsBasedNeedsService'
import { isInEditMode } from './formRouterBuilder'
import ForbiddenError from '../../server/errors/forbiddenError'

// eslint-disable-next-line import/prefer-default-export
export const assessmentOrForbidden = async (
  req: FormWizard.Request,
  apiService: StrengthsBasedNeedsAssessmentsApiService,
) => {
  const sessionData = req.session.sessionData as SessionData
  const isViewOnly = !isInEditMode(sessionData.user, req)
  const isModeViewOrViewHistoric = ['view', 'view-historic'].includes(req.params.mode)

  const forbiddenWhen = [
    isViewOnly && req.method !== 'GET',
    isViewOnly && !isModeViewOrViewHistoric,
    req.params.mode === 'edit' && req.params.uuid !== sessionData.assessmentId,
  ]

  if (forbiddenWhen.some(isForbidden => isForbidden)) {
    throw new ForbiddenError(req)
  }

  const assessment =
    req.params.mode === 'edit'
      ? await apiService.fetchAssessment(req.params.uuid)
      : await apiService.fetchAssessmentVersion(req.params.uuid)

  if (isModeViewOrViewHistoric && assessment.metaData.uuid !== sessionData.assessmentId) {
    throw new ForbiddenError(req)
  }

  return assessment
}
