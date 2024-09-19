import { assertVictimEntry } from './questions/victim/summary'
import utils from './questions/victim/utils'

describe('/offence-analysis-victim/delete/:entryId', () => {
  const createUrl = '/offence-analysis-victim/create'
  const collectionSummaryUrl = '/offence-analysis-victim-details'

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
      raceOrEthnicityPartial: 'Any other White background',
      raceOrEthnicity: 'White - Any other White background',
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
      cy.visitStep(createUrl)

      utils.enterVictimDetailsWith(victimDetails)

      cy.assertStepUrlIs(collectionSummaryUrl)
    })

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(collectionSummaryUrl)
    cy.assertQuestionCount(1)

    cy.hasCollectionEntries('Victims', victims.length)

    victims.forEach((entryDetails, index) => {
      const entryNumber = index + 1
      assertVictimEntry(entryNumber, entryDetails)
    })
  })

  it('deletes the assessment entry', () => {
    cy.getCollectionEntry('victim', 1).find('.govuk-link').contains('Delete').click()

    cy.get('#delete-1')
      .should('be.visible')
      .within(() => {
        cy.checkAccessibility()
        cy.contains('p', 'Are you sure you want to delete the victim details?')
        cy.contains('.govuk-link', 'Cancel').click()
      })

    cy.get('#delete-1').should('not.be.visible')

    cy.getCollectionEntry('victim', 1).find('.govuk-link').contains('Delete').click()

    cy.get('#delete-1').should('be.visible').contains('button', 'Delete').click()

    cy.hasCollectionEntries('Victims', 1)

    const secondEntry = victims[1]
    assertVictimEntry(1, secondEntry)

    cy.getCollectionEntry('victim', 1).find('.govuk-link').contains('Delete').click()

    cy.get('#delete-1').should('be.visible').contains('button', 'Delete').click()

    cy.get('form')
      .contains('Victims')
      .closest('fieldset')
      .within(() => {
        cy.get('.form-group').should('have.length', 0)
        cy.contains('There are no victims.')
      })
  })
})
