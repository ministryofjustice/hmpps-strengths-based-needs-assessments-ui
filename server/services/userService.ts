import { convertToTitleCase } from '../utils/utils'
import getHmppsAuthClient, { HmppsAuthClient } from '../data/hmppsAuthClient'

interface UserDetails {
  name: string
  displayName: string
}

export default class UserService {
  hmppsAuthClient

  constructor(_hmppsAuthClient?: HmppsAuthClient) {
    this.hmppsAuthClient = _hmppsAuthClient || getHmppsAuthClient()
  }

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.hmppsAuthClient.getUser(token)
    return { ...user, displayName: convertToTitleCase(user.name) }
  }
}
