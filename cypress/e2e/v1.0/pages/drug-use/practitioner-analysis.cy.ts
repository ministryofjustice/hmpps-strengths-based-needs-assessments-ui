import testPractitionerAnalysis from '../../common/practitioner-analysis/testPractitionerAnalysis'
import motivatedToStopOrReduceDrugUse from '../../common/practitioner-analysis/questions/motivatedToStopOrReduceDrugUse'

const summaryPage = '/drug-use-summary'

describe(`Sam hasn't misused drugs`, () => {
  before(() => {
    cy.createAssessment().enterAssessment()

    cy.visitSection('Drug use')
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('No').clickLabel()
    cy.saveAndContinue()
    cy.assertStepUrlIs(summaryPage)
    cy.assertResumeUrlIs('Drug use', summaryPage)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(summaryPage)
    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
  })

  testPractitionerAnalysis(summaryPage, '/drug-use-analysis', 'drug use')
})

describe(`Sam has misused drugs`, () => {
  before(() => {
    cy.createAssessment().enterAssessment()

    cy.visitSection('Drug use')
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('Yes').clickLabel()
    cy.saveAndContinue()

    cy.getQuestion('Which drugs has Sam misused?').getCheckbox('Cannabis').clickLabel()
    cy.getQuestion('Which drugs has Sam misused?')
      .getCheckbox('Cannabis')
      .getConditionalQuestion()
      .getRadio('Used more than 6 months ago')
      .clickLabel()
    cy.saveAndContinue()

    cy.getQuestion(`Give details about Sam's Cannabis use`).enterText('Test')
    cy.getQuestion('Has Sam ever received treatment for their drug use?').getRadio('No').clickLabel()
    cy.saveAndContinue()

    cy.getQuestion('Why did Sam use drugs?').getCheckbox('Other').clickLabel()
    cy.getQuestion(`How has Sam's drug use affected their life?`).getCheckbox('Behaviour').clickLabel()
    cy.getQuestion('Does Sam want to make changes to their drug use?').getRadio('Not applicable').clickLabel()
    cy.saveAndContinue()

    cy.assertStepUrlIs(summaryPage)
    cy.assertResumeUrlIs('Drug use', summaryPage)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(summaryPage)
    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()

    cy.get('#tab_practitioner-analysis').click()
    cy.get('#practitioner-analysis').should('be.visible')
    cy.assertQuestionCount(4)
  })

  motivatedToStopOrReduceDrugUse(summaryPage, '/drug-use-analysis', 1)
})
