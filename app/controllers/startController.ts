import { Request, Response, NextFunction } from 'express'
import StrengthsBasedNeedsAssessmentsApiService, {
  AssessmentResponse,
} from '../../server/services/strengthsBasedNeedsService'
import ArnsHandoverService, { HandoverContextData } from '../../server/services/arnsHandoverService'
import { createAnswerDto, isReadOnly } from './saveAndContinue.utils'
import thinkingBehavioursFields from '../form/v1_0/fields/thinking-behaviours-attitudes'
import { stepUrls } from '../form/v1_0/steps/thinking-behaviours-attitudes'
import { assessmentComplete } from '../form/v1_0/fields'

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

    if (!isReadOnly(contextData.principal)) await setSexuallyMotivatedOffenceHistory(assessment, contextData)

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

const setSexuallyMotivatedOffenceHistory = async (assessment: AssessmentResponse, contextData: HandoverContextData) => {
  const field = thinkingBehavioursFields.thinkingBehavioursAttitudesRiskSexualHarm
  const oasysAnswer = contextData.subject.sexuallyMotivatedOffenceHistory
  const sectionCompleteField = thinkingBehavioursFields.sectionComplete()
  const isUserSubmittedField = thinkingBehavioursFields.isUserSubmitted(stepUrls.thinkingBehavioursAttitudes)

  if (oasysAnswer !== null && oasysAnswer !== assessment.assessment[field.code]?.value) {
    await apiService.updateAnswers(assessment.metaData.uuid, {
      answersToAdd: {
        [field.code]: createAnswerDto(field, contextData.subject.sexuallyMotivatedOffenceHistory),
        [sectionCompleteField.code]: createAnswerDto(sectionCompleteField, 'NO'),
        [isUserSubmittedField.code]: createAnswerDto(isUserSubmittedField, 'NO'),
        [assessmentComplete.code]: createAnswerDto(assessmentComplete, 'NO'),
      },
      answersToRemove: [],
    })
  }
}

export default startController
