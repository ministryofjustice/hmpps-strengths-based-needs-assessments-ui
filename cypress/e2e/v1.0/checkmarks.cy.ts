import { Fixture } from '../../support/commands/fixture'

describe('assessment complete checkmarks', () => {
  beforeEach(() => {
    cy.loadFixture(Fixture.CompleteAssessment)
    cy.enterAssessment()
  })

  const sectionsThatRemainCompleteAfterChange = [
    'Accommodation',
    'Employment and education',
    'Finances',
    'Alcohol use',
    'Health and wellbeing',
    'Personal relationships and community',
    'Thinking, behaviours and attitudes',
    'Offence analysis',
  ]

  const sectionsThatCanBeIncompleteAfterChange = [/*'Drug use'*/]

  const allSections = sectionsThatRemainCompleteAfterChange.concat(sectionsThatCanBeIncompleteAfterChange)

  it('all checkmarks are visible', () => {
    allSections.forEach(section => {
      cy.sectionMarkedAsComplete(section)
    })
    cy.assessmentMarkedAsComplete()
  })

  describe('checkmarks are not removed on change', () => {
    allSections
      .filter(section => section !== 'Offence analysis')
      .forEach(section => {
        it(`${section} checkmark is not removed`, () => {
          cy.visitSection(section).enterBackgroundSubsection()
          cy.get('a:contains(Change)').first().click()
          cy.saveAndContinue()
          cy.sectionMarkedAsComplete(section)
          allSections.forEach(s => cy.sectionMarkedAsComplete(s))
          cy.assessmentMarkedAsComplete()
        })
      })

    // it(`Offence analysis checkmark is removed`, () => {
    //   const section = 'Offence analysis'
    //   cy.visitSection(section)
    //   cy.getSummary('Why did the current index offence(s) happen?').clickChange()
    //   cy.getQuestion('Why did the current index offence(s) happen?').enterText('')
    //   cy.saveAndContinue()
    //   cy.sectionNotMarkedAsComplete(section)
    //   allSections.filter(s => s !== section).forEach(s => cy.sectionMarkedAsComplete(s))
    //   cy.assessmentNotMarkedAsComplete()
    // })
  })
})
