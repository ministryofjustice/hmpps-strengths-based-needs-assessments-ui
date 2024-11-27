import StrengthsBasedNeedsAssessmentsApiService from './strengthsBasedNeedsService'

export const services = () => {
  const apiClient = new StrengthsBasedNeedsAssessmentsApiService()

  return {
    apiService: apiClient,
  }
}

export type Services = ReturnType<typeof services>
