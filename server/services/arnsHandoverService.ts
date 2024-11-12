import config from '../config'
import RestClient from '../data/restClient'
import getHmppsAuthClient from '../data/hmppsAuthClient'
import { Gender } from '../@types/hmpo-form-wizard/enums'

export default class ArnsHandoverService {
  authClient

  constructor() {
    this.authClient = getHmppsAuthClient()
  }

  private static restClient(token?: string): RestClient {
    return new RestClient('HMPPS Handover Api Client', config.apis.arnsHandover, token)
  }

  getContextData(token: string): Promise<HandoverContextData> {
    return ArnsHandoverService.restClient(token).get<HandoverContextData>({ path: `/context` })
  }

  async createHandoverLink(handoverContext: Record<string, unknown>) {
    const token = await this.authClient.getSystemClientToken()
    const handover = await ArnsHandoverService.restClient(token).post<{ handoverLink: string }>({
      path: '/handover',
      data: handoverContext,
    })
    return `${handover.handoverLink}?clientId=${config.apis.arnsHandover.clientId}`
  }
}

export type HandoverContextData = {
  handoverSessionId: string
  principal: HandoverPrincipal
  subject: HandoverSubject
  assessmentContext: HandoverAssessmentContext
}

export type HandoverPrincipal = {
  identifier: string
  displayName: string
  accessMode: 'READ_WRITE' | 'READ_ONLY'
  returnUrl?: string
}

export type HandoverSubject = {
  crn: string
  pnc: string
  nomisId?: string
  givenName: string
  familyName: string
  dateOfBirth: string
  gender: Gender
  location: 'PRISON' | 'COMMUNITY'
  sexuallyMotivatedOffenceHistory?: 'YES' | 'NO'
}

export type HandoverAssessmentContext = {
  assessmentId: string
  oasysAssessmentPk?: string
  assessmentVersion: number
}
