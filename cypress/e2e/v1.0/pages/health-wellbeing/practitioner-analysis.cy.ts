import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'

const summaryPage = '/health-wellbeing-summary'

before(() => {
  cy.createAssessment().enterAssessment()

  cy.visitSection('Health and wellbeing')
  cy.getQuestion('Does Sam have any physical health conditions?').getRadio('No').clickLabel()
  cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?').getRadio('No').clickLabel()
  cy.saveAndContinue()

  cy.getQuestion('Has Sam had a head injury or any illness affecting the brain?').getRadio('No').clickLabel()
  cy.getQuestion('Does Sam have any neurodiverse conditions?').getRadio('No').clickLabel()
  cy.getQuestion('Does Sam have any conditions or disabilities that impact their ability to learn? (optional)')
    .getRadio('No, they do not have any conditions or disabilities that impact their ability to learn')
    .clickLabel()
  cy.getQuestion('Is Sam able to cope with day-to-day life?').getRadio('Yes, able to cope well').clickLabel()
  cy.getQuestion("What is Sam's attitude towards themselves?").getRadio('Positive and reasonably happy').clickLabel()
  cy.getQuestion('Has Sam ever self-harmed?').getRadio('No').clickLabel()
  cy.getQuestion('Has Sam ever attempted suicide or had suicidal thoughts?').getRadio('No').clickLabel()
  cy.getQuestion('How does Sam feel about their future?').getRadio('Sam does not want to answer').clickLabel()
  cy.getQuestion('Does Sam want to make changes to their health and wellbeing?')
    .getRadio('Sam is not present')
    .clickLabel()
  cy.saveAndContinue()

  cy.assertStepUrlIs(summaryPage)
  cy.assertResumeUrlIs('Health and wellbeing', summaryPage)

  cy.captureAssessment()
})

beforeEach(() => {
  cy.cloneCapturedAssessment().enterAssessment()
  cy.visitStep(summaryPage)
  cy.hasAutosaveEnabled()
  cy.hasFeedbackLink()
})

testPractitionerAnalysis(summaryPage, '/health-wellbeing-analysis', 'health and wellbeing')
