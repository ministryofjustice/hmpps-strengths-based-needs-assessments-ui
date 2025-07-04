import { Request } from 'express'
import { HandoverPrincipal } from '../services/arnsHandoverService'
import { convertToTitleCase, initialiseName, isInEditMode } from './utils'

describe('server/utils/utils', () => {
  describe('convert to title case', () => {
    it.each([
      [null, null, ''],
      ['empty string', '', ''],
      ['Lower case', 'robert', 'Robert'],
      ['Upper case', 'ROBERT', 'Robert'],
      ['Mixed case', 'RoBErT', 'Robert'],
      ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
      ['Leading spaces', '  RobeRT', '  Robert'],
      ['Trailing spaces', 'RobeRT  ', 'Robert  '],
      ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
    ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
      expect(convertToTitleCase(a)).toEqual(expected)
    })
  })

  describe('initialise name', () => {
    it.each([
      [null, null, null],
      ['Empty string', '', null],
      ['One word', 'robert', 'r. robert'],
      ['Two words', 'Robert James', 'R. James'],
      ['Three words', 'Robert James Smith', 'R. Smith'],
      ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
    ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
      expect(initialiseName(a)).toEqual(expected)
    })
  })

  describe('isReadOnly', () => {
    it('returns true when the user is in read-only mode', () => {
      expect(
        isInEditMode(
          {
            identifier: 'TEST_USER',
            displayName: 'Test user',
            accessMode: 'READ_ONLY',
          } as HandoverPrincipal,
          { params: { mode: 'view' } } as unknown as Request,
        ),
      ).toEqual(false)

      expect(
        isInEditMode(
          {
            identifier: 'TEST_USER',
            displayName: 'Test user',
            accessMode: 'READ_WRITE',
          } as HandoverPrincipal,
          { params: { mode: 'edit' } } as unknown as Request,
        ),
      ).toEqual(true)
    })
  })
})
