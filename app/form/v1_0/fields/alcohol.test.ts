import { orNoImpactValidator } from './alcohol'

describe('sbna-poc/fields/accommodation', () => {
  describe('livingWithValidator', () => {
    const contextWithAnswers = (answers: Record<string, string | string[]>) => ({
      values: answers,
    })

    it('returns true when only "NO_NEGATIVE_IMPACT" is selected', () => {
      const answers = {
        alcohol_impact_of_use: ['NO_NEGATIVE_IMPACT'],
      }

      expect(orNoImpactValidator.bind(contextWithAnswers(answers))()).toEqual(true)
    })

    it('returns true when options other than "NO_NEGATIVE_IMPACT" are selected', () => {
      const answers = {
        alcohol_impact_of_use: ['FAMILY'],
      }

      expect(orNoImpactValidator.bind(contextWithAnswers(answers))()).toEqual(true)
    })

    it('returns false when "NO_NEGATIVE_IMPACT" is selected alongside another option', () => {
      const answers = {
        alcohol_impact_of_use: ['FINANCES', 'NO_NEGATIVE_IMPACT'],
      }

      expect(orNoImpactValidator.bind(contextWithAnswers(answers))()).toEqual(false)
    })

    it('returns true when not answered', () => {
      const answers = {
        alcohol_impact_of_use: [] as string[],
      }

      expect(orNoImpactValidator.bind(contextWithAnswers(answers))()).toEqual(true)
      expect(orNoImpactValidator.bind(contextWithAnswers({}))()).toEqual(true)
    })
  })
})
