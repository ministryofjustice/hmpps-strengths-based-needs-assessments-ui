import { Request } from 'express'
import { HandoverPrincipal } from '../services/arnsHandoverService'
import { isInEditMode } from './utils'

describe('server/utils/utils', () => {
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
