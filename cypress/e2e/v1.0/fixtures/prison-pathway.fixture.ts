import { Fixture } from '../../../support/commands/fixture'

describe('Generate fixture for drug user', () => {
  it('creates the fixture', () => {
    cy.createAssessment({ assessment: { pathway: { value: 'PRISON' } } })
    cy.saveAsFixture(Fixture.PrisonPathway)
  })
})
