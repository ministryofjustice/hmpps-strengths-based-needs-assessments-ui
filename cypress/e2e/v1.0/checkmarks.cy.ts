import { Fixture } from '../../support/commands/fixture'

describe('assessment complete checkmarks', () => {
  beforeEach(() => {
    cy.loadFixture(Fixture.CompleteAssessment)
    cy.enterAssessment()
  })

  const sections = [
    'Accommodation',
    'Employment and education',
    'Finance',
    'Drug use',
    'Alcohol use',
    'Health and wellbeing',
    'Personal relationships and community',
    'Thinking, behaviours and attitudes',
    'Offence analysis',
  ]

  it('all checkmarks are visible', () => {
    sections.forEach(section => {
      cy.sectionMarkedAsComplete(section)
    })
    cy.assessmentMarkedAsComplete()
  })

  describe('checkmarks are removed on change', () => {
    sections
      .filter(section => section !== 'Offence analysis')
      .forEach(section => {
        it(`${section} checkmark is removed`, () => {
          cy.visitSection(section)
          cy.get('a:contains(Change)').first().click()
          cy.saveAndContinue()
          cy.sectionNotMarkedAsComplete(section)
          sections.filter(s => s !== section).forEach(s => cy.sectionMarkedAsComplete(s))
          cy.assessmentNotMarkedAsComplete()
        })
      })

    it(`Offence analysis checkmark is removed`, () => {
      const section = 'Offence analysis'
      cy.visitSection(section)
      cy.getSummary('Why did the offence happen?').clickChange()
      cy.getQuestion('Why did the offence happen?').enterText('')
      cy.saveAndContinue()
      cy.sectionNotMarkedAsComplete(section)
      sections.filter(s => s !== section).forEach(s => cy.sectionMarkedAsComplete(s))
      cy.assessmentNotMarkedAsComplete()
    })
  })
})
