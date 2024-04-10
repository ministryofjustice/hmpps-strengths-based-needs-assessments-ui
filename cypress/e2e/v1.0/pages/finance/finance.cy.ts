import bankAccount from './questions/bankAccount'
import debt from './questions/debt'
import financeSource from './questions/financeSource'
import gambling from './questions/gambling'
import managingMoney from './questions/managingMoney'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/finance', () => {
  const stepUrl = '/finance'
  const summaryPage = '/finance-summary-analysis'
  const questions = [bankAccount, debt, financeSource, gambling, managingMoney, wantToMakeChanges]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitStep(stepUrl)
    cy.assertSectionIs('Fiance')
    // cy.assertQuestionCount(3)
    cy.getQuestion("Where does Sam currently get their money from?").getCheckbox('Carer\'s allowance').clickLabel()
    cy.getQuestion("Does Sam have their own bank account?").getRadio('Yes').clickLabel()
    cy.getQuestion("How good is Sam at managing their money?").getRadio('Able to manage their money well and is a strength').clickLabel()
    cy.getQuestion("Is Sam affected by gambling?").getCheckbox('No').clickLabel()
    cy.getQuestion("Is Sam affected by debt").getCheckbox('No').clickLabel()
    cy.getQuestion("Does Sam want to make changes to their finance?").getCheckbox('Sam is not present').clickLabel()
    cy.saveAndContinue()
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
