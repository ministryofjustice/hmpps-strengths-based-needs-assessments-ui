import { Fixture } from '../../../support/commands/fixture'

describe('Generate fixture for drug user', () => {
  it('creates the fixture', () => {
    cy.createAssessment().enterAssessment().completePrivacyDeclaration()
    cy.visitSection('Drug use')
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()
    cy.saveAsFixture(Fixture.DrugUser)
  })
})
