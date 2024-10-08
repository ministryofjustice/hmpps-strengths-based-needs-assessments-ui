import { UUID } from 'crypto'
import querystring from 'querystring'
import config from '../config'
import RestClient from '../data/restClient'
import getHmppsAuthClient from '../data/hmppsAuthClient'
import { FieldType } from '../@types/hmpo-form-wizard/enums'
import { HandoverPrincipal } from './arnsHandoverService'

export interface CreateAssessmentRequest extends Record<string, unknown> {
  oasysAssessmentPk: string
  userDetails: {
    id: string
    name: string
  }
}

export interface CreateAssessmentResponse {
  sanAssessmentId: UUID
  sanAssessmentVersion: number
  sentencePlanId?: UUID
  sentencePlanVersion?: number
}

export interface SessionData {
  assessmentId: string
  assessmentVersion: number
  oasysAssessmentPk: string
  user: HandoverPrincipal
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

export type AnswerDTOs = Record<string, AnswerDto>

export type OasysEquivalent = Record<string, string | string[]>

interface AssessmentMetaData {
  uuid: string
  createdAt: string
  oasys_pks: string[]
  versionUuid: string
  versionCreatedAt: string
  versionTag: string
  formVersion: string
}

export interface AssessmentResponse {
  assessment: AnswerDTOs
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
  answersToAdd: AnswerDTOs
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

  async fetchAssessment(assessmentId: string, versionNumber?: number): Promise<AssessmentResponse> {
    const client = await this.getRestClient()

    const requestOptions = Number.isInteger(versionNumber)
      ? { path: `/assessment/${assessmentId}`, query: querystring.stringify({ versionNumber }) }
      : { path: `/assessment/${assessmentId}` }

    const responseBody = await client.get(requestOptions)
    return responseBody as AssessmentResponse
  }

  async updateAnswers(assessmentId: string, requestBody: UpdateAnswersDto) {
    const client = await this.getRestClient()
    await client.post({ path: `/assessment/${assessmentId}/answers`, data: requestBody })
  }
}
