import testPractitionerAnalysis from '../../../common/practitioner-analysis/testPractitionerAnalysis'
import { Fixture } from '../../../../../support/commands/fixture'

const summaryPage = '/finance-summary'

before(() => {
  cy.loadFixture(Fixture.PrisonPathway).enterAssessment()

  cy.visitSection('Finance')
  cy.getQuestion('Where did Sam get their money from before custody?').getCheckbox('No money').clickLabel()
  cy.getQuestion('Where does Sam get their money from in custody?').getCheckbox('No money').clickLabel()
  cy.getQuestion('Does Sam have their own bank account?').getRadio('Unknown').clickLabel()
  cy.getQuestion('How good is Sam at managing their money?')
    .getRadio('Able to manage their money well and is a strength')
    .clickLabel()
  cy.getQuestion('Is Sam affected by gambling?').getCheckbox('Unknown').clickLabel()
  cy.getQuestion('Is Sam affected by debt?').getCheckbox('Unknown').clickLabel()
  cy.getQuestion('Does Sam want to make changes to their finances?').getRadio('Not applicable').clickLabel()
  cy.saveAndContinue()

  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Finance', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
  cy.hasFeedbackLink()
})

testPractitionerAnalysis(summaryPage, '/finance-analysis', 'finances')
