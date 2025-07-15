import getHmppsAuthClient from '../data/index'
import RestClient from '../data/restClient'
import config from '../config'

type EntityType = 'ASSESSMENT' | 'PLAN'

type VersionDetails = {
  uuid: string
  version: number
  createdAt: string
  updatedAt: string
  status: string
  entityType: EntityType
}

type VersionsOnDate = {
  description?: string
  assessmentVersions: VersionDetails[]
  planVersions: VersionDetails[]
}

export type VersionsResponse = {
  versions: Record<string, VersionsOnDate>
}

export default class CoordinatorApiService {
  authClient

  constructor() {
    this.authClient = getHmppsAuthClient()
  }

  private async getRestClient(): Promise<RestClient> {
    const token = await this.authClient.getSystemClientToken()
    return new RestClient('Coordinator API Client', config.apis.coordinatorApi, token)
  }

  async fetchAssessmentAndPlanVersions(assessmentUuid: string): Promise<VersionsResponse> {
    const client = await this.getRestClient()
    return client.get<VersionsResponse>({ path: `/entity/versions/${assessmentUuid}` })
  }
}
