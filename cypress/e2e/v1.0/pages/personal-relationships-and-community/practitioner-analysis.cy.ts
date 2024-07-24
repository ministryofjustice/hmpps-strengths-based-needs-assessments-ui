import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/personal-relationships-community-analysis'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Personal relationships and community')
  cy.getQuestion("Who are the important people in Sam's life?").getCheckbox('Friends').clickLabel()
  cy.saveAndContinue()

  cy.getQuestion('Is Sam happy with their current relationship status?')
    .getRadio('Has some concerns about their relationship status but is overall happy')
    .clickLabel()
  cy.getQuestion("What is Sam's history of intimate relationships?")
    .getRadio('History of both positive and negative relationships')
    .clickLabel()
  cy.getQuestion('Is Sam able to resolve any challenges in their intimate relationships?').enterText('test')
  cy.getQuestion("What is Sam's current relationship like with their family?").getRadio('Unknown').clickLabel()
  cy.getQuestion('What was Sam’s experience of their childhood?').getRadio('Positive experience').clickLabel()
  cy.getQuestion('Did Sam have any childhood behavioural problems?').getRadio('No').clickLabel()
  cy.getQuestion('Does Sam want to make changes to their personal relationships and community?')
    .getRadio('Not applicable')
    .clickLabel()
  cy.saveAndContinue()

  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Personal relationships and community', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
})

testPractitionerAnalysis(
  summaryPage,
  '/personal-relationships-community-analysis-complete',
  'personal relationships and community',
)
