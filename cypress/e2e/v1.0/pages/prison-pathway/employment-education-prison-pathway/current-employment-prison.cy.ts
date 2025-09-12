import employmentStatusPrison from './questions/employmentStatus'
import { Fixture } from '../../../../../support/commands/fixture'

describe('/current-employment-prison', () => {
  const stepUrl = '/current-employment-prison'
  const summaryPage = '/employment-education-summary'
  const questions = [employmentStatusPrison]

  beforeEach(() => {
    cy.loadFixture(Fixture.PrisonPathway).enterAssessment()
    cy.assertResumeUrlIs('Employment and education', stepUrl)
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Employment and education')
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
