import testPractitionerAnalysis from '../../../common/practitioner-analysis/testPractitionerAnalysis'
import { Fixture } from '../../../../../support/commands/fixture'

const summaryPage = '/employment-education-summary'

before(() => {
  cy.loadFixture(Fixture.PrisonPathway).enterAssessment()

  cy.visitSection('Employment and education')
  cy.getQuestion("What was Sam's employment status before custody?").getRadio('Retired').clickLabel()
  cy.saveAndContinue()

  cy.getQuestion("What was Sam's employment history before custody?")
    .getRadio('Continuous employment history')
    .clickLabel()
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
  cy.hasFeedbackLink()
})

testPractitionerAnalysis(summaryPage, '/employment-education-analysis', 'employment and education')
