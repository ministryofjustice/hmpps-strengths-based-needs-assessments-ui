import { Request, Response, NextFunction } from 'express'
import StrengthsBasedNeedsAssessmentsApiService, {
  AssessmentResponse,
  SessionData,
  userDetailsFromSession,
} from '../../server/services/strengthsBasedNeedsService'
import ArnsHandoverService, { HandoverSubject } from '../../server/services/arnsHandoverService'
import { createAnswerDto } from './saveAndContinue.utils'
import thinkingBehavioursFields from '../form/v1_0/fields/thinking-behaviours-attitudes'
import { assessmentComplete } from '../form/v1_0/fields'
import ForbiddenError from '../../server/errors/forbiddenError'
import sections from '../form/v1_0/config/sections'

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

    const inEditMode = contextData.principal.accessMode === 'READ_WRITE'

    if (inEditMode) {
      await setSexuallyMotivatedOffenceHistory(assessment, contextData.subject, req.session.sessionData as SessionData)
    }

    req.session.save(error => {
      if (error) {
        throw error
      }
      res.redirect(`/form/view-historic/${assessment.metaData.versionUuid}/accommodation-tasks`)
    })
  } catch {
    next(new Error('Unable to start assessment'))
  }
}

const setSexuallyMotivatedOffenceHistory = async (
  assessment: AssessmentResponse,
  subject: HandoverSubject,
  session: SessionData,
) => {
  const field = thinkingBehavioursFields.thinkingBehavioursAttitudesRiskSexualHarm
  const oasysAnswer = subject.sexuallyMotivatedOffenceHistory
  const sanAnswer = assessment.assessment[field.code]?.value
  const sectionCompleteField = thinkingBehavioursFields.sectionComplete()
  const isUserSubmittedField = thinkingBehavioursFields.isUserSubmitted(
    sections.thinkingBehaviours.subsections.background.stepUrls.thinkingBehavioursAttitudes,
  )

  if (oasysAnswer === 'YES' && oasysAnswer !== sanAnswer) {
    await apiService.updateAnswers(assessment.metaData.uuid, {
      answersToAdd: {
        [field.code]: createAnswerDto(field, oasysAnswer),
        [sectionCompleteField.code]: createAnswerDto(sectionCompleteField, 'NO'),
        [isUserSubmittedField.code]: createAnswerDto(isUserSubmittedField, 'NO'),
        [assessmentComplete.code]: createAnswerDto(assessmentComplete, 'NO'),
      },
      answersToRemove: [],
      userDetails: userDetailsFromSession(session),
    })
  }
}

export default viewHistoricalVersions
