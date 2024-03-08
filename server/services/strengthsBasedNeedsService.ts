import { UUID } from 'crypto'
import { FieldType } from 'hmpo-form-wizard'
import config from '../config'
import RestClient from '../data/restClient'
import getHmppsAuthClient from '../data/hmppsAuthClient'

export interface CreateSessionRequest extends Record<string, unknown> {
  userSessionId: string
  userAccess: string
  oasysAssessmentPk: string
}

export interface CreateSessionResponse {
  link: string
}

export interface UseOneTimeLinkRequest extends Record<string, unknown> {
  form: string
  version: string
}

export interface SessionInformation {
  uuid: UUID
  sessionId: string
  accessLevel: string
  assessmentUUID: UUID
  userDisplayName: string
}

export interface SubjectResponse {
  givenName: string
  familyName: string
  dateOfBirth: string
  crn: string
  pnc: string
}

interface Option {
  value: string
  text: string
}

export interface AnswerDto {
  type: FieldType
  description: string
  options?: Option[]
  value?: string
  values?: string[]
  collection?: Record<string, AnswerDto>[]
}

export type Answers = Record<string, AnswerDto>

export type OasysEquivalent = Record<string, string | string[]>

export interface AssessmentResponse {
  assessment: Answers
  oasysEquivalent: OasysEquivalent
}

export interface UpdateAnswersDto extends Record<string, unknown> {
  answersToAdd: Answers
  answersToRemove: string[]
  tags?: string[]
}

export default class StrengthsBasedNeedsAssessmentsApiService {
  authClient

  constructor() {
    this.authClient = getHmppsAuthClient()
  }

  private async getRestClient(): Promise<RestClient> {
    const token = await this.authClient.getSystemClientToken()
    return new RestClient('Strengths Based Needs Assessments API Client', config.apis.sbnaApi, token)
  }

  async createSession(requestBody: CreateSessionRequest) {
    const client = await this.getRestClient()
    const responseBody = await client.post({ path: '/oasys/session/create', data: requestBody })
    return responseBody as CreateSessionResponse
  }

  async useOneTimeLink(sessionId: string, requestBody: UseOneTimeLinkRequest): Promise<SessionInformation> {
    const client = await this.getRestClient()
    const responseBody = await client.post({ path: `/oasys/session/${sessionId}`, data: requestBody })
    return responseBody as SessionInformation
  }

  async validateSession(sessionId: string): Promise<SessionInformation> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/oasys/session/${sessionId}/validate` })
    return responseBody as SessionInformation
  }

  async getSubject(assessmentUuid: string): Promise<SubjectResponse> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/subject/${assessmentUuid}` })
    return responseBody as SubjectResponse
  }

  async fetchAssessment(assessmentUuid: string, tag: string = 'UNVALIDATED'): Promise<AssessmentResponse> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/assessment/${assessmentUuid}?tag=${tag}` })
    return responseBody as AssessmentResponse
  }

  async updateAnswers(assessmentUuid: string, requestBody: UpdateAnswersDto) {
    const client = await this.getRestClient()
    await client.post({ path: `/assessment/${assessmentUuid}/answers`, data: requestBody })
  }
}
