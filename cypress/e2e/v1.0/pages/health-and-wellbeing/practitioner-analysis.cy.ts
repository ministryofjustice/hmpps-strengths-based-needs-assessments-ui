import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/health-wellbeing-analysis'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Health and wellbeing')
  cy.getQuestion('Does Sam have any physical health conditions?').getRadio('No').clickLabel()
  cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?').getRadio('No').clickLabel()
  cy.saveAndContinue()

  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Health and wellbeing', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(summaryPage, '/health-wellbeing-analysis-complete', 'health and wellbeing')
