import { Fixture } from '../../../../support/commands/fixture'
import { drugs } from './common/drugs'
import receivingTreatment from './questions/receivingTreatment'
import detailsAboutUseOfTheseDrugs from './questions/detailsAboutUseOfTheseDrugs'

describe('/drug-details-more-than-six-months', () => {
  const stepUrl = '/drug-details-more-than-six-months'
  const summaryPage = '/drug-use-summary'
  const usedDrugs = drugs.filter(drug => !drug.injectable).map(drug => drug.name)
  const questions = [detailsAboutUseOfTheseDrugs, receivingTreatment(false)]

  before(() => {
    cy.loadFixture(Fixture.DrugUser).enterAssessment()
    cy.visitSection('Drug use')
    usedDrugs.forEach(drug => {
      cy.getQuestion('Which drugs has Sam misused?').getCheckbox(drug).clickLabel()
      if (drug === 'Other') {
        cy.getQuestion('Which drugs has Sam misused?').getCheckbox(drug).getNthConditionalQuestion(0).enterText('Cake')
        cy.getQuestion('Which drugs has Sam misused?')
          .getCheckbox(drug)
          .getNthConditionalQuestion(1)
          .getRadio('Used more than 6 months ago')
          .clickLabel()
      } else {
        cy.getQuestion('Which drugs has Sam misused?')
          .getCheckbox(drug)
          .getConditionalQuestion()
          .getRadio('Used more than 6 months ago')
          .clickLabel()
      }
    })
    cy.saveAndContinue()

    cy.assertStepUrlIs(stepUrl)
    cy.hasDrugQuestionGroups(0)
    cy.assertQuestionCount(questions.length)

    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
    cy.assertResumeUrlIs('Drug use', stepUrl)

    cy.hasSubheading('Not used in the last 6 months', true)
    cy.hasSubheading('Used in the last 6 months', false)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitSection('Drug use')
    cy.assertStepUrlIs(stepUrl)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('pulls the list of drugs used more than 6 months ago', () => {
    const previouslyUsed = usedDrugs.join(', ')

    cy.get('form > .govuk-inset-text')
      .contains(`Sam used ${previouslyUsed} more than 6 months ago.`)
      .should('have.length', 1)
      .and('be.visible')

    const usedRecently = usedDrugs.pop()

    cy.visitStep('/add-drugs')
    cy.getQuestion('Which drugs has Sam misused?')
      .getCheckbox(usedRecently)
      .getConditionalQuestion()
      .getRadio('Used in the last 6 months')
      .clickLabel()
    cy.saveAndContinue()

    cy.assertStepUrlIs(stepUrl)

    const nowUsed = usedDrugs.join(', ')

    cy.get('form > .govuk-inset-text')
      .contains(`Sam used ${nowUsed} more than 6 months ago.`)
      .should('have.length', 1)
      .and('be.visible')

    expect(previouslyUsed).not.to.eq(nowUsed)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
