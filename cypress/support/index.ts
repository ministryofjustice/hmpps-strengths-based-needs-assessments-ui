import { createAssessment, saveAndContinue } from './commands/assessment'
import { assertSectionIs, assertStepUrlIs, assertStepUrlIsNot, visitSection, visitStep } from './commands/navigation'
import {
  getConditionalQuestion,
  hasConditionalQuestion,
  isChecked,
  isNotChecked,
  isOptionNumber,
  selectOption,
} from './commands/option'
import { assertQuestionCount } from './commands/page'
import {
  getQuestion,
  getRadio,
  hasHint,
  hasRadios,
  hasTitle,
  hasValidationError,
  isQuestionNumber,
} from './commands/question'

declare global {
  namespace Cypress {
    interface Chainable {
      // assessment
      createAssessment(): Chainable
      saveAndContinue(): Chainable

      // navigation
      visitSection(name: string): Chainable
      assertSectionIs(name: string): Chainable
      visitStep(path: string): Chainable
      assertStepUrlIs(path: string): Chainable
      assertStepUrlIsNot(path: string): Chainable

      // option
      isChecked(): Chainable
      isNotChecked(): Chainable
      isOptionNumber(position: number): Chainable
      selectOption(): Chainable
      hasConditionalQuestion(expect?: boolean): Chainable
      getConditionalQuestion(): Chainable

      // page
      assertQuestionCount(count: number): Chainable

      // question
      getQuestion(title: string): Chainable
      hasTitle(title: string): Chainable
      isQuestionNumber(position: number): Chainable
      hasHint(hint: string): Chainable
      hasRadios(options: string[]): Chainable
      hasValidationError(message: string): Chainable
      getRadio(label: string): Chainable
    }
  }
}

// assessment
Cypress.Commands.add('createAssessment', createAssessment)
Cypress.Commands.add('saveAndContinue', saveAndContinue)

// navigation
Cypress.Commands.add('visitSection', visitSection)
Cypress.Commands.add('assertSectionIs', assertSectionIs)
Cypress.Commands.add('visitStep', visitStep)
Cypress.Commands.add('assertStepUrlIs', assertStepUrlIs)
Cypress.Commands.add('assertStepUrlIsNot', assertStepUrlIsNot)

// option
Cypress.Commands.add('isChecked', { prevSubject: true }, isChecked)
Cypress.Commands.add('isNotChecked', { prevSubject: true }, isNotChecked)
Cypress.Commands.add('isOptionNumber', { prevSubject: true }, isOptionNumber)
Cypress.Commands.add('selectOption', { prevSubject: true }, selectOption)
Cypress.Commands.add('hasConditionalQuestion', { prevSubject: true }, hasConditionalQuestion)
Cypress.Commands.add('getConditionalQuestion', { prevSubject: true }, getConditionalQuestion)

// page
Cypress.Commands.add('assertQuestionCount', assertQuestionCount)

// question
Cypress.Commands.add('getQuestion', getQuestion)
Cypress.Commands.add('hasTitle', { prevSubject: true }, hasTitle)
Cypress.Commands.add('isQuestionNumber', { prevSubject: true }, isQuestionNumber)
Cypress.Commands.add('hasHint', { prevSubject: true }, hasHint)
Cypress.Commands.add('hasValidationError', { prevSubject: true }, hasValidationError)
Cypress.Commands.add('getRadio', { prevSubject: true }, getRadio)
Cypress.Commands.add('hasRadios', { prevSubject: true }, hasRadios)
