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

  const sectionsThatCanBeIncompleteAfterChange = ['Drug use']

  const allSections = sectionsThatRemainCompleteAfterChange.concat(sectionsThatCanBeIncompleteAfterChange)

  it('all checkmarks are visible', () => {
    allSections.forEach(section => {
      cy.sectionHasCompletionBlueTick(section)
    })
    cy.assessmentMarkedAsComplete()
  })

  describe('checkmarks are not removed on change', () => {
    sectionsThatRemainCompleteAfterChange.forEach(section => {
      it(`${section} checkmark is not removed`, () => {
        if (section === 'Offence analysis') {
          cy.visitSection(section)
        } else {
          cy.visitSection(section).enterBackgroundSubsection()
        }

        cy.get('a:contains(Change)').first().click()
        cy.saveAndContinue()
        cy.sectionHasCompletionBlueTick(section)
        allSections.forEach(s => cy.sectionHasCompletionBlueTick(s))
        cy.assessmentMarkedAsComplete()
      })
    })

    it(`Drug use checkmark is removed`, () => {
      const section = 'Drug use'
      cy.visitSection(section).enterBackgroundSubsection()
      cy.get('a:contains(Change)').first().click()
      cy.getQuestion('Has Sam ever misused drugs?').getRadio('No').clickLabel()
      cy.saveAndContinue()
      cy.sectionDoesNotHaveCompletionBlueTick(section)
      allSections.filter(s => s !== section).forEach(s => cy.sectionHasCompletionBlueTick(s))
      cy.assessmentNotMarkedAsComplete()
    })
  })
})
