import { Fixture } from '../../../../support/commands/fixture'
import whichDrugs from './questions/whichDrugs'

describe('/add-drugs', () => {
  const stepUrl = '/add-drugs'
  const summaryPage = '/drug-use-summary'
  const questions = [whichDrugs]

  beforeEach(() => {
    cy.loadFixture(Fixture.DrugUser).enterAssessment()
    cy.visitSection('Drug use').enterBackgroundSubsection()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Drug use', 'Assessment', stepUrl)
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
