import { isAllowedPattern } from './azureAppInsights'

describe('azureAppInsights', () => {
  describe('isAllowedPattern', () => {
    it('should return false when the operation is in the excluded list', () => {
      expect(isAllowedPattern('GET /assets/js/foo.js')).toBe(false)
      expect(isAllowedPattern('GET /ping')).toBe(false)
      expect(isAllowedPattern('GET /metrics')).toBe(false)
      expect(isAllowedPattern('GET /health')).toBe(false)
    })

    it('should return true when the operation is not in the excluded list', () => {
      expect(isAllowedPattern('GET /form/1/0/foo')).toBe(true)
      expect(isAllowedPattern('POST /form/1/0/bar')).toBe(true)
    })

    it('should return true when the operation has no value', () => {
      expect(isAllowedPattern('')).toBe(true)
      expect(isAllowedPattern(null)).toBe(true)
      expect(isAllowedPattern(undefined)).toBe(true)
    })
  })
})
