import { Fixture } from '../../../support/commands/fixture'
import { AccessMode } from '../../../support/commands/api'

describe('History of Sexually Motivated Offence conditional logic', () => {
  const destinations = {
    landingPage: '/thinking-behaviours-attitudes',
    sexualOffending: '/thinking-behaviours-attitudes-sexual-offending',
    thinkingBehaviours: '/thinking-behaviours',
    summary: '/thinking-behaviours-attitudes-summary',
    analysis: '/thinking-behaviours-attitudes-analysis',
  }

  const sectionName = 'Thinking, behaviours and attitudes'
  const question = 'Are there any concerns that Sam poses a risk of sexual harm to others?'

  beforeEach(() => {
    cy.loadFixture(Fixture.CompleteAssessment)
    cy.enterAssessment()
    cy.sectionMarkedAsComplete(sectionName)
    cy.assessmentMarkedAsComplete()
    cy.visitSection(sectionName)
    cy.getSummary(question).getAnswer('No')
  })

  it('value from OASys overrides SAN', () => {
    cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: 'YES' })
    cy.sectionNotMarkedAsComplete(sectionName)
    cy.assessmentNotMarkedAsComplete()
    cy.visitSection(sectionName)
    cy.assertStepUrlIs(destinations.landingPage)
    cy.getQuestion(question).getRadio('Yes').isChecked()
    cy.getQuestion(question).getRadio('No').isDisabled()
    cy.saveAndContinue()
    cy.assertStepUrlIs(destinations.sexualOffending)

    cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: 'NO' })
    cy.sectionNotMarkedAsComplete(sectionName)
    cy.assessmentNotMarkedAsComplete()
    cy.visitSection(sectionName)
    cy.assertStepUrlIs(destinations.landingPage)
    cy.getQuestion(question).getRadio('Yes').isDisabled()
    cy.getQuestion(question).getRadio('No').isChecked()
    cy.saveAndContinue()
    cy.assertStepUrlIs(destinations.thinkingBehaviours)
  })

  it('value from OASys matches the existing value in SAN', () => {
    cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: 'NO' })
    cy.sectionMarkedAsComplete(sectionName)
    cy.assessmentMarkedAsComplete()
    cy.visitSection(sectionName)
    cy.getSummary(question).getAnswer('No')
  })

  it('null value from OASys does not override SAN', () => {
    cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: null })
    cy.sectionMarkedAsComplete(sectionName)
    cy.assessmentMarkedAsComplete()
    cy.visitSection(sectionName)
    cy.getSummary(question).getAnswer('No')
  })
})
