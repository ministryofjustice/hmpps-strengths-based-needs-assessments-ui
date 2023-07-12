import StrengthsBasedNeedsAssessmentsApiService from './strengthsBasedNeedsService'
import UserService from './userService'

export const services = () => {
  const userService = new UserService()
  const apiClient = new StrengthsBasedNeedsAssessmentsApiService()

  return {
    userService,
    apiService: apiClient,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
