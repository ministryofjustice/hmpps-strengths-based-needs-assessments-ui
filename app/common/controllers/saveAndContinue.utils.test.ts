import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { processReplacements } from './saveAndContinue.utils'

describe('saveAndContinue.utils', () => {
  describe('processReplacements', () => {
    it('replaces the placeholder values in strings', () => {
      const fields: FormWizard.Field[] = [
        {
          text: "[person]'s details",
          code: 'person_details',
          type: FieldType.Text,
        },
      ]

      const [personDetails] = processReplacements(fields, { person: 'Dave' })

      expect(personDetails.text).toEqual("Dave's details")
    })

    it('leaves the placeholder values in strings when there is no replacement value', () => {
      const fields: FormWizard.Field[] = [
        {
          text: "[person]'s details",
          code: 'person_details',
          type: FieldType.Text,
        },
      ]

      const [personDetails] = processReplacements(fields, { foo: 'Dave' })

      expect(personDetails.text).toEqual("[person]'s details")
    })
  })
})
