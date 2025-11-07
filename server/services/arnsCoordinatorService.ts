import config from '../config'
import RestClient from '../data/restClient'
import getHmppsAuthClient from '../data/index'

type EntityType = 'ASSESSMENT' | 'PLAN'

type VersionDetails = {
  uuid: string
  version: number
  createdAt: string
  updatedAt: string
  status: string
  planAgreementStatus: string | null
  entityType: EntityType
}

interface LastVersionsOnDate {
  description: string
  assessmentVersion: VersionDetails
  planVersion: VersionDetails
}

type VersionsTable = Record<string, LastVersionsOnDate>

export interface PreviousVersionsResponse {
  allVersions: VersionsTable
  countersignedVersions: VersionsTable
}

export default class ArnsCoordinatorApiService {
  private authClient

  constructor() {
    this.authClient = getHmppsAuthClient()
  }

  private async getRestClient(): Promise<RestClient> {
    const token = await this.authClient.getSystemClientToken()
    return new RestClient('Coordinator API Client', config.apis.coordinatorApi, token)
  }

  async getVersionsByEntityId(entityUuid: string) {
    const client = await this.getRestClient()
    return client.get<PreviousVersionsResponse>({ path: `/entity/versions/${entityUuid}`})
  }
}
