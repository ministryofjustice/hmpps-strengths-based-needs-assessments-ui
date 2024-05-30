import { UUID } from 'crypto'
import { FieldType, Gender } from 'hmpo-form-wizard'
import config from '../config'
import RestClient from '../data/restClient'
import getHmppsAuthClient from '../data/hmppsAuthClient'

export interface SubjectDetailsRequest extends Record<string, unknown> {
  crn?: string
  pnc?: string
  nomisId?: string
  givenName: string
  familyName: string
  dateOfBirth: string
  gender: number
  location: 'PRISON' | 'COMMUNITY'
  sexuallyMotivatedOffenceHistory?: string
}

export interface CreateAssessmentRequest extends Record<string, unknown> {
  oasysAssessmentPk: string
  subjectDetails?: SubjectDetailsRequest
}

export interface CreateAssessmentResponse {
  sanAssessmentId: UUID
  sanAssessmentVersion: number
  sentencePlanId?: UUID
  sentencePlanVersion?: number
}

export interface CreateSessionRequest extends Record<string, unknown> {
  oasysAssessmentPk: string
  user: {
    identifier: string
    displayName: string
    accessMode: string
    returnUrl?: string
  }
  subjectDetails: SubjectDetailsRequest
}

export interface SessionInformation {
  uuid: UUID
  assessmentUUID: UUID
  user: {
    identifier: string
    displayName: string
    accessMode: string
    returnUrl?: string
  }
}

export interface CreateSessionResponse {
  link: string
}

export interface UseOneTimeLinkRequest extends Record<string, unknown> {
  form: string
  version: string
}

export interface SubjectResponse {
  givenName: string
  familyName: string
  dateOfBirth: string
  gender: Gender
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

interface AssessmentMetaData {
  uuid: string
  createdAt: string
  oasys_pks: string[]
  versionUuid: string
  versionCreatedAt: string
  versionTag: string
  formVersion?: string
}

export interface AssessmentResponse {
  assessment: Answers
  oasysEquivalent: OasysEquivalent
  metaData: AssessmentMetaData
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

  async createAssessment(requestBody: CreateAssessmentRequest) {
    const client = await this.getRestClient()
    const responseBody = await client.post({ path: '/oasys/assessment/create', data: requestBody })
    return responseBody as CreateAssessmentResponse
  }

  async createSession(requestBody: CreateSessionRequest) {
    const client = await this.getRestClient()
    const responseBody = await client.post({ path: '/oasys/session/one-time-link', data: requestBody })
    return responseBody as CreateSessionResponse
  }

  async useOneTimeLink(sessionId: string, requestBody: UseOneTimeLinkRequest): Promise<SessionInformation> {
    const client = await this.getRestClient()
    const responseBody = await client.post({ path: `/oasys/session/${sessionId}/one-time-link`, data: requestBody })
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
