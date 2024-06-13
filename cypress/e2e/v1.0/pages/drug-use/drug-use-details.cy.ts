import whyStartedUsing from './questions/whyStartedUsing'
import impactOfDrugUse from './questions/impactOfDrugUse'
import helpedToStopOrReduce from './questions/helpedToStopOrReduce'
import motivatedToStopOrReduce from './questions/motivatedToStopOrReduce'

describe('/drug-use', () => {
  const stepUrl = '/drug-use-details'
  const summaryPage = '/drug-use-analysis'
  const questions = [whyStartedUsing, impactOfDrugUse, helpedToStopOrReduce, motivatedToStopOrReduce]

  beforeEach(() => {
    cy.createAssessment().enterAssessment()
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Drug use')
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
