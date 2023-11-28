import { livingWithValidator } from './accommodation'

describe('sbna-poc/fields/accommodation', () => {
  describe('livingWithValidator', () => {
    const contextWithAnswers = (answers: Record<string, string | string[]>) => ({
      values: answers,
    })

    it('returns true when only "ALONE" is selected', () => {
      const answers = {
        living_with: ['ALONE'],
      }

      expect(livingWithValidator.bind(contextWithAnswers(answers))()).toEqual(true)
    })

    it('returns true when options other than "ALONE" are selected', () => {
      const answers = {
        living_with: ['FAMILY'],
      }

      expect(livingWithValidator.bind(contextWithAnswers(answers))()).toEqual(true)
    })

    it('returns false when "ALONE" is selected alongside another option', () => {
      const answers = {
        living_with: ['FAMILY', 'ALONE'],
      }

      expect(livingWithValidator.bind(contextWithAnswers(answers))()).toEqual(false)
    })

    it('returns true when not answered', () => {
      const answers = {
        living_with: [] as string[],
      }

      expect(livingWithValidator.bind(contextWithAnswers(answers))()).toEqual(true)
      expect(livingWithValidator.bind(contextWithAnswers({}))()).toEqual(true)
    })
  })
})
