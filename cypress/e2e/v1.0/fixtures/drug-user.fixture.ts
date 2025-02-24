import { Fixture } from '../../../support/commands/fixture'

describe('Generate fixture for drug user', () => {
  it('creates the fixture', () => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Drug use')
    cy.getQuestion('Has Sam ever used drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()
    cy.getQuestion('Why did Sam start using drugs?').getCheckbox('Enhance performance').clickLabel()
    cy.getQuestion("What's the impact of Sam using drugs?").getCheckbox('Behavioural').clickLabel()
    cy.getQuestion('Has anything helped Sam to stop or reduce using drugs in the past?').getRadio('No').clickLabel()
    cy.getQuestion('Is Sam motivated to stop or reduce their drug use?').getRadio('Unknown').clickLabel()
    cy.saveAndContinue()
    cy.saveAsFixture(Fixture.DrugUser)
  })
})
