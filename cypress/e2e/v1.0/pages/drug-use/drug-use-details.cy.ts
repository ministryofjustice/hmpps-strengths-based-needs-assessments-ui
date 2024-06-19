import whyStartedUsing from './questions/whyStartedUsing'
import impactOfDrugUse from './questions/impactOfDrugUse'
import helpedToStopOrReduce from './questions/helpedToStopOrReduce'
import motivatedToStopOrReduce from './questions/motivatedToStopOrReduce'

describe('/drug-use', () => {
  const stepUrl = '/drug-use-details'
  const summaryPage = '/drug-use-analysis'
  const questions = [whyStartedUsing, impactOfDrugUse, helpedToStopOrReduce, motivatedToStopOrReduce]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Drug use')
    cy.getQuestion('Has Sam ever used drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()
    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
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
