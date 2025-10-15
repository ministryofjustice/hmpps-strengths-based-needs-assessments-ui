import descriptionOfTheOffence from './questions/descriptionOfTheOffence'
import elementsOfTheOffence from './questions/elementsOfTheOffence'
import whyDidItHappen from './questions/whyDidItHappen'
import motivations from './questions/motivations'
import whoWasTheOffenceCommittedAgainst from './questions/whoWasTheOffenceCommittedAgainst'

describe('/offence-analysis', () => {
  const stepUrl = '/offence-analysis'
  const summaryPage = '/offence-analysis-summary'
  const questions = [
    descriptionOfTheOffence,
    elementsOfTheOffence,
    whyDidItHappen,
    motivations,
    whoWasTheOffenceCommittedAgainst,
  ]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Offence analysis')
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Offence analysis', '', stepUrl)
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
