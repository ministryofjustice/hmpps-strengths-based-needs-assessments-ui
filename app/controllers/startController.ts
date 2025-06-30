import { Request, Response, NextFunction } from 'express'
import StrengthsBasedNeedsAssessmentsApiService, {
  AssessmentResponse,
  SessionData,
  userDetailsFromSession,
} from '../../server/services/strengthsBasedNeedsService'
import ArnsHandoverService, { HandoverSubject } from '../../server/services/arnsHandoverService'
import { createAnswerDto, isReadOnly } from './saveAndContinue.utils'
import thinkingBehavioursFields from '../form/v1_0/fields/thinking-behaviours-attitudes'
import { stepUrls } from '../form/v1_0/steps/thinking-behaviours-attitudes'
import { assessmentComplete } from '../form/v1_0/fields'

const apiService = new StrengthsBasedNeedsAssessmentsApiService()
const arnsHandoverService = new ArnsHandoverService()

const editModeLandingPage = 'close-anything-not-needed-before-appointment'
const readOnlyModeLandingPage = 'accommodation-analysis'

const startController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = res.locals.user.token
    const contextData = await arnsHandoverService.getContextData(accessToken)

    const assessment = await apiService.fetchAssessment(contextData.assessmentContext.assessmentId)
    const versionUrl = assessment.metaData.formVersion.replace(/\./g, '/')

    req.session.sessionData = {
      ...contextData.assessmentContext,
      user: contextData.principal,
      handoverSessionId: contextData.handoverSessionId,
      formVersion: assessment.metaData.formVersion,
    }
    req.session.subjectDetails = contextData.subject

    if (!isReadOnly(contextData.principal))
      await setSexuallyMotivatedOffenceHistory(assessment, contextData.subject, req.session.sessionData as SessionData)

    req.session.save(error => {
      if (error) {
        return next(error)
      }
      return isReadOnly(contextData.principal)
        ? res.redirect(`/form/${versionUrl}/view/${assessment.metaData.versionUuid}/${readOnlyModeLandingPage}`)
        : res.redirect(`/form/${versionUrl}/edit/${assessment.metaData.uuid}/${editModeLandingPage}`)
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
  const isUserSubmittedField = thinkingBehavioursFields.isUserSubmitted(stepUrls.thinkingBehavioursAttitudes)

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

export default startController
