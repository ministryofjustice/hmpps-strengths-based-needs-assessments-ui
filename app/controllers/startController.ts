import { Request, Response, NextFunction } from 'express'
import StrengthsBasedNeedsAssessmentsApiService from '../../server/services/strengthsBasedNeedsService'
import ArnsHandoverService from '../../server/services/arnsHandoverService'
import { isReadOnly } from './saveAndContinue.utils'

const apiService = new StrengthsBasedNeedsAssessmentsApiService()
const arnsHandoverService = new ArnsHandoverService()

const editModeLandingPage = 'current-accommodation'
const readOnlyModeLandingPage = 'accommodation-analysis'

const startController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = res.locals.user.token
    const contextData = await arnsHandoverService.getContextData(accessToken)

    const assessment = await apiService.fetchAssessment(contextData.assessmentContext.assessmentId)
    const version = assessment.metaData.formVersion.replace(/\./g, '/')

    req.session.sessionData = {
      ...contextData.assessmentContext,
      assessmentId: contextData.assessmentContext.assessmentId,
      user: contextData.principal,
    }
    req.session.subjectDetails = contextData.subject
    req.session.save(error => {
      if (error) {
        return next(error)
      }

      return isReadOnly(contextData.principal)
        ? res.redirect(`/form/${version}/${readOnlyModeLandingPage}`)
        : res.redirect(`/form/${version}/${editModeLandingPage}?action=resume`)
    })
  } catch {
    next(new Error('Unable to start assessment'))
  }
}

export default startController
