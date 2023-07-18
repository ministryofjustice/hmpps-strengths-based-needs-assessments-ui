import { UUID } from 'crypto'
import config from '../config'
import RestClient from '../data/restClient'
import getHmppsAuthClient from '../data/hmppsAuthClient'

export interface CreateSessionRequest extends Record<string, unknown> {
  userSessionId: string
  userAccess: string
  oasysAssessmentId: string
}

export interface CreateSessionResponse {
  link: string
}

export interface SessionResponse {
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

export interface OffenderDetailsResponse {
  firstName: string
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
    const responseBody = await client.post({ path: '/session/create', data: requestBody })
    return responseBody as CreateSessionResponse
  }

  async getSession(sessionId: string): Promise<SessionResponse> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/session/${sessionId}` })
    return responseBody as SessionResponse
  }

  async validateSession(sessionId: string): Promise<SessionResponse> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/session/${sessionId}/validate` })
    return responseBody as SessionResponse
  }

  async getSubject(assessmentUuid: string): Promise<SubjectResponse> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/subject/${assessmentUuid}` })
    return responseBody as SubjectResponse
  }

  async getOffenderDetails(): Promise<OffenderDetailsResponse> {
    return { firstName: 'Paul' }
  }
}
