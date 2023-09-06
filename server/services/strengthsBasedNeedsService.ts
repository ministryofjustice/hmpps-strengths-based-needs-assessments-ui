import { UUID } from 'crypto'
import { FieldType } from 'hmpo-form-wizard'
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

export interface OffenderDetailsResponse {
  firstName: string
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

export interface UpdateAnswersDto extends Record<string, unknown> {
  answersToAdd: Answers
  answersToRemove: string[]
}

export interface UpdateAnswersInCollectionDto extends Record<string, unknown> {
  index: number
  answers: {
    answersToAdd: Answers
    answersToRemove: string[]
  }
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

  async useOneTimeLink(sessionId: string, requestBody: UseOneTimeLinkRequest): Promise<SessionInformation> {
    const client = await this.getRestClient()
    const responseBody = await client.post({ path: `/session/${sessionId}`, data: requestBody })
    return responseBody as SessionInformation
  }

  async validateSession(sessionId: string): Promise<SessionInformation> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/session/${sessionId}/validate` })
    return responseBody as SessionInformation
  }

  async getSubject(assessmentUuid: string): Promise<SubjectResponse> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/subject/${assessmentUuid}` })
    return responseBody as SubjectResponse
  }

  async getOffenderDetails(): Promise<OffenderDetailsResponse> {
    return { firstName: 'Paul' }
  }

  async fetchAnswers(assessmentUuid: string): Promise<Answers> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/assessment/${assessmentUuid}/answers` })
    return responseBody as Answers
  }

  async updateAnswers(assessmentUuid: string, requestBody: UpdateAnswersDto) {
    const client = await this.getRestClient()
    await client.post({ path: `/assessment/${assessmentUuid}/answers`, data: requestBody })
  }

  async addToCollection(assessmentUuid: string, collectionName: string, requestBody: UpdateAnswersDto) {
    const client = await this.getRestClient()
    await client.post({ path: `/assessment/${assessmentUuid}/collection/${collectionName}`, data: requestBody })
  }

  async updateAnswersInCollection(
    assessmentUuid: string,
    collectionName: string,
    requestBody: UpdateAnswersInCollectionDto,
  ) {
    const client = await this.getRestClient()
    await client.put({ path: `/assessment/${assessmentUuid}/collection/${collectionName}`, data: requestBody })
  }

  async getFromCollection(assessmentUuid: string, collectionName: string, index: number): Promise<Answers> {
    const client = await this.getRestClient()
    const responseBody = await client.get({
      path: `/assessment/${assessmentUuid}/collection/${collectionName}/index/${index}`,
    })
    return responseBody as Answers
  }

  async removeFromCollection(assessmentUuid: string, collectionName: string, index: number) {
    const client = await this.getRestClient()
    await client.delete({ path: `/assessment/${assessmentUuid}/collection/${collectionName}/index/${index}` })
  }
}
