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
      raceOrEthnicity: 'White - English, Welsh, Scottish, Northern Irish or British',
    },
    {
      relationship: "Sam's ex-partner",
      age: '21 to 25 years',
      sex: 'Female',
      raceOrEthnicity: 'White - Any other White background',
    },
  ]

  before(() => {
    cy.createAssessment().enterAssessment().completePrivacyDeclaration()
    cy.visitSection('Offence analysis')

    cy.getQuestion('Enter a brief description of the current index offence(s)').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Did the current index offence(s) have any of the following elements?')
      .getCheckbox('Arson')
      .clickLabel()
    cy.getQuestion('Why did the current index offence(s) happen?').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Did the current index offence(s) involve any of the following motivations?')
      .getCheckbox('Thrill seeking')
      .clickLabel()
    cy.getQuestion('Who was the offence committed against?').getCheckbox('One or more people').clickLabel()

    cy.saveAndContinue()

    victims.forEach(victimDetails => {
      cy.visitStep(createUrl)

      utils.enterVictimDetailsWith(victimDetails)

      cy.assertStepUrlIs(collectionSummaryUrl)
    })

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment().completePrivacyDeclaration()
    cy.visitStep(collectionSummaryUrl)
    cy.assertQuestionCount(1)

    cy.hasCollectionEntries('Victims', victims.length)

    victims.forEach((entryDetails, index) => {
      const entryNumber = index + 1
      assertVictimEntry(entryNumber, entryDetails)
    })
  })

  it('selects the delete button using the keyboard', () => {
    cy.getCollectionEntry('victim', 1).find('.govuk-link').contains('Change').focus()
    cy.press(Cypress.Keyboard.Keys.TAB)
    cy.focused().should('have.attr', 'data-toggle', 'modal')
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
