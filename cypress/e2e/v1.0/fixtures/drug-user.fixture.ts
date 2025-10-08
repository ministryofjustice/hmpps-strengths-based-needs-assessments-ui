import { Fixture } from '../../../support/commands/fixture'

describe('Generate fixture for drug user', () => {
  it('creates the fixture', () => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Drug use').enterBackgroundSubsection()
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()
    cy.saveAsFixture(Fixture.DrugUser)
  })
})
