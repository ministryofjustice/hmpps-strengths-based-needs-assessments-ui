import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/employment-education-analysis'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Employment and education')
  cy.getQuestion("What is Sam's current employment status?").getRadio('Retired').clickLabel()
  cy.saveAndContinue()

  cy.getQuestion("What is Sam's employment history?").getRadio('Continuous employment history').clickLabel()
  cy.getQuestion('Does Sam have any additional day-to-day commitments?').getCheckbox('Studying').clickLabel()
  cy.getQuestion('Select the highest level of academic qualification Sam has completed')
    .getRadio('Entry level')
    .clickLabel()
  cy.getQuestion('Does Sam have any professional or vocational qualifications?').getRadio('No').clickLabel()
  cy.getQuestion('Does Sam have any skills that could help them in a job or to get a job?').getRadio('No').clickLabel()
  cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
    .getCheckbox('Yes, with reading')
    .clickLabel()
  cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
    .getCheckbox('Yes, with reading')
    .getConditionalQuestion()
    .getRadio('Some difficulties')
    .clickLabel()
  cy.getQuestion('Does Sam want to make changes to their employment and education?')
    .getRadio('Not applicable')
    .clickLabel()
  cy.saveAndContinue()

  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Employment and education', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(summaryPage, '/employment-education-analysis-complete', 'employment and education')
