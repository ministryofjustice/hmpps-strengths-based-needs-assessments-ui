import { Request, Response, NextFunction } from 'express'
import ArnsHandoverService from '../../server/services/arnsHandoverService'
import ForbiddenError from '../../server/errors/forbiddenError'
import StrengthsBasedNeedsAssessmentsApiService from '../../server/services/strengthsBasedNeedsService'

const apiService = new StrengthsBasedNeedsAssessmentsApiService()
const arnsHandoverService = new ArnsHandoverService()

const viewHistoricalVersions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = res.locals.user.token
    const contextData = await arnsHandoverService.getContextData(accessToken)

    const assessment = await apiService.fetchAssessment(
      contextData.assessmentContext.assessmentId,
      contextData.assessmentContext.assessmentVersion,
    )

    if (assessment.metaData.uuid !== contextData.assessmentContext.assessmentId) {
      next(new ForbiddenError(req))
    }

    req.session.sessionData = {
      ...contextData.assessmentContext,
      user: contextData.principal,
      handoverSessionId: contextData.handoverSessionId,
    }
    req.session.subjectDetails = contextData.subject

    req.session.save(error => {
      if (error) {
        throw error
      }
      res.redirect(`/form/view-historic/${assessment.metaData.versionUuid}/accommodation-tasks`)
    })
  } catch {
    next(new Error('Unable to view previous assessment'))
  }
}

export default viewHistoricalVersions
