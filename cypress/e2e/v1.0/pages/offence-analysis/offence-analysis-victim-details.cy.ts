import { assertVictimEntry } from './questions/victim/summary'
import utils from './questions/victim/utils'

describe('/offence-analysis-victim-details', () => {
  const stepUrl = '/offence-analysis-victim-details'
  const createPage = '/offence-analysis-victim/create'

  const victims = [
    {
      relationship: 'A stranger',
      age: '26 to 49 years',
      sex: 'Male',
      raceOrEthnicityPartial: 'English',
      raceOrEthnicity: 'White - English, Welsh, Scottish, Northern Irish or British',
    },
    {
      relationship: "Victim's ex-partner",
      age: '21 to 25 years',
      sex: 'Female',
      raceOrEthnicityPartial: 'White - Irish',
      raceOrEthnicity: 'White - Irish',
    },
  ]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Offence analysis')

    cy.getQuestion('Enter a brief description of the current index offence(s)').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Did the current index offence(s) have any of the following elements?')
      .getCheckbox('Arson')
      .clickLabel()
    cy.getQuestion('Why did the current index offence(s) happen?').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Did the current index offence(s) involve any of the following motivations?')
      .getCheckbox('Thrill seeking')
      .clickLabel()
    cy.getQuestion('Who was the victim?').getCheckbox('One or more person').clickLabel()

    cy.saveAndContinue()

    victims.forEach(victimDetails => {
      cy.visitStep(createPage)
      utils.enterVictimDetailsWith(victimDetails)
    })

    cy.assertStepUrlIs(stepUrl)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(stepUrl)
    cy.assertQuestionCount(1)

    cy.hasCollectionEntries('Victims', 2)
  })

  it('displays the victims collection summary', () => {
    victims.forEach((victimDetails, index) => {
      const victimNumber = index + 1
      assertVictimEntry(victimNumber, victimDetails)
    })
  })

  it('has a change link', () => {
    cy.getCollectionEntry('victim', 1)
      .find('a')
      .contains('Change')
      .should('have.attr', 'href')
      .and('equal', 'offence-analysis-victim/edit/0')
  })

  it('has a delete button', () => {
    cy.getCollectionEntry('victim', 1).find('.govuk-link').contains('Delete').as('deleteButton')
    // check configured as a button for assistive technologies
    cy.get('@deleteButton').should('have.attr', 'role').and('equal', 'button')
    // check configured to toggle the delete prompt
    cy.get('@deleteButton').should('have.attr', 'data-toggle').and('equal', 'modal')
    // check configured to delete the first element
    cy.get('@deleteButton').should('have.attr', 'data-target').and('equal', 'delete-1')
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})