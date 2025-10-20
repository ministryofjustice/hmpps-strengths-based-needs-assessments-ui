import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'
import sections from '../../../../../app/form/v1_0/config/sections'

const summaryPage = `/${sections.personalRelationships.subsections.background.stepUrls.backgroundSummary}`
const analysisPage = `/${sections.personalRelationships.subsections.practitionerAnalysis.stepUrls.analysis}`
const analysisSummaryPage = `/${sections.personalRelationships.subsections.practitionerAnalysis.stepUrls.analysisSummary}`

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Personal relationships and community').enterBackgroundSubsection()
  cy.getQuestion("Are there any children in Sam's life?")
    .getCheckbox("No, there are no children in Sam's life")
    .clickLabel()
  cy.saveAndContinue()

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
  cy.getQuestion("What was Sam's experience of their childhood?").getRadio('Positive experience').clickLabel()
  cy.getQuestion('Did Sam have any childhood behavioural problems?').getRadio('No').clickLabel()
  cy.getQuestion('Does Sam want to make changes to their personal relationships and community?')
    .getRadio('Not applicable')
    .clickLabel()
  cy.saveAndContinue()

  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Personal relationships and community', 'Assessment', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(analysisPage)
  cy.hasAutosaveEnabled()
  cy.hasFeedbackLink()
})

testPractitionerAnalysis(analysisPage, analysisSummaryPage, 'personal relationships and community')
