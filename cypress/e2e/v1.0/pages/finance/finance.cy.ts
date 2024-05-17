import bankAccount from './questions/bankAccount'
import debt from './questions/debt'
import financeSource from './questions/financeSource'
import gambling from './questions/gambling'
import managingMoney from './questions/managingMoney'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/finance', () => {
  const stepUrl = '/finance'
  const summaryPage = '/finance-analysis'
  const questions = [financeSource, bankAccount, managingMoney, gambling, debt, wantToMakeChanges]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Finance')
    cy.assertStepUrlIs(stepUrl)
    cy.assertQuestionCount(questions.length)
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
