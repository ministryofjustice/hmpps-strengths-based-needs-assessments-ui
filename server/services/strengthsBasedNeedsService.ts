import querystring from 'querystring'
import config from '../config'
import RestClient from '../data/restClient'
import getHmppsAuthClient from '../data/index'
import { FieldType } from '../@types/hmpo-form-wizard/enums'
import { HandoverPrincipal } from './arnsHandoverService'

export interface SessionData {
  assessmentId: string
  assessmentVersion: number
  oasysAssessmentPk: string
  user: HandoverPrincipal
  handoverSessionId: string
  formVersion: string
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
  versionNumber: number
}

export interface AssessmentResponse {
  assessment: AnswerDTOs
  oasysEquivalent: OasysEquivalent
  metaData: AssessmentMetaData
}

export type AssessmentVersionsResponse = Array<{
  uuid: string
  createdAt: string
  updatedAt: string
  tag: string
  versionNumber: number
}>

export interface UpdateAnswersDto extends Record<string, unknown> {
  answersToAdd: AnswerDTOs
  answersToRemove: string[]
  userDetails: UserDetails
}

interface UserDetails {
  id: string
  name: string
  type: string
}

export const userDetailsFromSession = (session: SessionData): UserDetails => ({
  id: session.user.identifier,
  name: session.user.displayName,
  type: 'OASYS',
})

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

  async fetchAssessmentVersion(versionUuid: string): Promise<AssessmentResponse> {
    const client = await this.getRestClient()
    return client.get<AssessmentResponse>({ path: `/assessment/version/${versionUuid}` })
  }

  async updateAnswers(assessmentId: string, requestBody: UpdateAnswersDto) {
    const client = await this.getRestClient()
    await client.post({ path: `/assessment/${assessmentId}/answers`, data: requestBody })
  }
}
