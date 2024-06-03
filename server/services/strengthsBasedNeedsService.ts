import { UUID } from 'crypto'
import { FieldType } from 'hmpo-form-wizard'
import config from '../config'
import RestClient from '../data/restClient'
import getHmppsAuthClient from '../data/hmppsAuthClient'

export interface CreateAssessmentRequest extends Record<string, unknown> {
  oasysAssessmentPk: string
}

export interface CreateAssessmentResponse {
  sanAssessmentId: UUID
  sanAssessmentVersion: number
  sentencePlanId?: UUID
  sentencePlanVersion?: number
}

export interface SessionInformation {
  uuid: UUID
  assessmentId: UUID
  user: {
    identifier: string
    displayName: string
    accessMode: string
    returnUrl?: string
  }
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

export interface OasysAssessmentResponse {
  sanAssessmentId: string
  sanAssessmentVersion: number
  sanAssessmentData: AssessmentResponse
  lastUpdatedTimestamp: string
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

  async fetchOasysAssessment(oasysAssessmentPk: string): Promise<OasysAssessmentResponse> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/oasys/assessment/${oasysAssessmentPk}` })
    return responseBody as OasysAssessmentResponse
  }

  async fetchAssessment(assessmentId: string, tag: string = 'UNVALIDATED'): Promise<AssessmentResponse> {
    const client = await this.getRestClient()
    const responseBody = await client.get({ path: `/assessment/${assessmentId}?tag=${tag}` })
    return responseBody as AssessmentResponse
  }

  async updateAnswers(assessmentId: string, requestBody: UpdateAnswersDto) {
    const client = await this.getRestClient()
    await client.post({ path: `/assessment/${assessmentId}/answers`, data: requestBody })
  }
}
