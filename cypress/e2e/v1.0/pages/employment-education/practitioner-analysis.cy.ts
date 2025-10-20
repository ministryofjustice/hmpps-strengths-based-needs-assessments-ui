import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'
import sections from '../../../../../app/form/v1_0/config/sections'

const summaryPage = `/${sections.employmentEducation.subsections.background.stepUrls.backgroundSummary}`
const analysisPage = `/${sections.employmentEducation.subsections.practitionerAnalysis.stepUrls.analysis}`
const analysisSummaryPage = `/${sections.employmentEducation.subsections.practitionerAnalysis.stepUrls.analysisSummary}`

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Employment and education').enterBackgroundSubsection()
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
  cy.assertResumeUrlIs('Employment and education', 'Assessment', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(analysisPage)
  cy.hasAutosaveEnabled()
  cy.hasFeedbackLink()
})

testPractitionerAnalysis(analysisPage, analysisSummaryPage, 'employment and education')
