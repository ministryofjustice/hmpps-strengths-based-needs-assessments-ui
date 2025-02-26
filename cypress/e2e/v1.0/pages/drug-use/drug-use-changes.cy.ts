import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/select-drugs', () => {
  const stepUrl = '/drug-use-changes'
  const summaryPage = '/drug-use-summary'
  const questions = [wantToMakeChanges]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Drug use')
    cy.getQuestion('Has Sam ever used drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()
    cy.getQuestion('Why did Sam start using drugs?').getCheckbox('Enhance performance').clickLabel()
    cy.getQuestion("What's the impact of Sam using drugs?").getCheckbox('Behavioural').clickLabel()
    cy.getQuestion('Has anything helped Sam to stop or reduce using drugs in the past?').getRadio('No').clickLabel()
    cy.getQuestion('Is Sam motivated to stop or reduce their drug use?').getRadio('Unknown').clickLabel()
    cy.saveAndContinue()
    cy.getQuestion('Which drugs has Sam used?').getCheckbox('Spice').clickLabel()
    cy.saveAndContinue()
    cy.getDrugQuestion('Spice', 'How often is Sam using this drug?')
      .getRadio('Not currently using this drug')
      .clickLabel()
    cy.getDrugQuestion('Spice', 'Has Sam used this drug in the past?').getRadio('No').clickLabel()
    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Drug use', stepUrl)
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
