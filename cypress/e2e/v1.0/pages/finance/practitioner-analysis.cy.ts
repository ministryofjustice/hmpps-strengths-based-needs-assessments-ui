import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/finance-analysis'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Finance')
  cy.getQuestion('Where does Sam currently get their money from?').getCheckbox('No money').clickLabel()
  cy.getQuestion('Does Sam have their own bank account?').getRadio('Unknown').clickLabel()
  cy.getQuestion('How good is Sam at managing their money?')
    .getRadio('Able to manage their money well and is a strength')
    .clickLabel()
  cy.getQuestion('Is Sam affected by gambling?').getRadio('Unknown').clickLabel()
  cy.getQuestion('Is Sam affected by debt?').getRadio('Unknown').clickLabel()
  cy.getQuestion('Does Sam want to make changes to their finance?').getRadio('Not applicable').clickLabel()
  cy.saveAndContinue()

  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Finance', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(summaryPage, '/finance-analysis-complete', 'finance')
