import financeSource from './questions/financeSource'
import { Fixture } from '../../../../../support/commands/fixture'
import financeSourceInCustody from './questions/financeSourceInCustody'
import bankAccount from '../../finance/questions/bankAccount'
import managingMoney from '../../finance/questions/managingMoney'
import gambling from '../../finance/questions/gambling'
import wantToMakeChanges from '../../finance/questions/wantToMakeChanges'
import debt from '../../finance/questions/debt'

describe('/finance-prison', () => {
  const stepUrl = '/finance-prison'
  const summaryPage = '/finance-summary'
  const questions = [
    financeSource,
    financeSourceInCustody,
    bankAccount,
    managingMoney,
    gambling,
    debt,
    wantToMakeChanges,
  ]

  beforeEach(() => {
    cy.loadFixture(Fixture.PrisonPathway).enterAssessment()
    cy.visitSection('Finances')
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Finances', stepUrl)
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
    cy.hasFeedbackLink()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
