import { createAssessment, saveAndContinue } from './commands/assessment'
import {
  assertQuestionUrl,
  assertSectionIs,
  assertStepUrlIs,
  assertStepUrlIsNot,
  visitSection,
  visitStep,
} from './commands/navigation'
import {
  enterText,
  getConditionalQuestion,
  hasConditionalQuestion,
  isChecked,
  isNotChecked,
  isOptionNumber,
  clickLabel,
} from './commands/option'
import { assertQuestionCount } from './commands/page'
import {
  enterDate,
  getCheckbox,
  getQuestion,
  getRadio,
  hasCheckboxes,
  hasHint,
  hasLimit,
  hasNoValidationError,
  hasRadios,
  hasTitle,
  hasValidationError,
  isQuestionNumber,
} from './commands/question'
import { clickChange, getAnswer, getSummary, hasNoSecondaryAnswer, hasSecondaryAnswer } from './commands/summary'

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
      assertQuestionUrl(question: string): Chainable

      // option
      isChecked(): Chainable
      isNotChecked(): Chainable
      isOptionNumber(position: number): Chainable
      clickLabel(): Chainable
      enterText(value: string): Chainable
      hasConditionalQuestion(expect?: boolean): Chainable
      getConditionalQuestion(): Chainable

      // page
      assertQuestionCount(count: number): Chainable

      // question
      getQuestion(title: string): Chainable
      hasTitle(title: string): Chainable
      isQuestionNumber(position: number): Chainable
      hasHint(hint: string): Chainable
      hasLimit(limit: number): Chainable
      hasRadios(options: string[]): Chainable
      hasCheckboxes(options: string[]): Chainable
      hasValidationError(message: string): Chainable
      hasNoValidationError(): Chainable
      getRadio(label: string): Chainable
      getCheckbox(label: string): Chainable
      enterDate(date: string): Chainable

      // summary
      getSummary(question: string): Chainable
      clickChange(): Chainable
      getAnswer(answer: string): Chainable
      hasSecondaryAnswer(...answers: string[]): Chainable
      hasNoSecondaryAnswer(): Chainable
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
Cypress.Commands.add('assertQuestionUrl', assertQuestionUrl)

// option
Cypress.Commands.add('isChecked', { prevSubject: true }, isChecked)
Cypress.Commands.add('isNotChecked', { prevSubject: true }, isNotChecked)
Cypress.Commands.add('isOptionNumber', { prevSubject: true }, isOptionNumber)
Cypress.Commands.add('clickLabel', { prevSubject: true }, clickLabel)
Cypress.Commands.add('enterText', { prevSubject: true }, enterText)
Cypress.Commands.add('hasConditionalQuestion', { prevSubject: true }, hasConditionalQuestion)
Cypress.Commands.add('getConditionalQuestion', { prevSubject: true }, getConditionalQuestion)

// page
Cypress.Commands.add('assertQuestionCount', assertQuestionCount)

// question
Cypress.Commands.add('getQuestion', getQuestion)
Cypress.Commands.add('hasTitle', { prevSubject: true }, hasTitle)
Cypress.Commands.add('isQuestionNumber', { prevSubject: true }, isQuestionNumber)
Cypress.Commands.add('hasHint', { prevSubject: true }, hasHint)
Cypress.Commands.add('hasLimit', { prevSubject: true }, hasLimit)
Cypress.Commands.add('hasValidationError', { prevSubject: true }, hasValidationError)
Cypress.Commands.add('hasNoValidationError', { prevSubject: true }, hasNoValidationError)
Cypress.Commands.add('getRadio', { prevSubject: true }, getRadio)
Cypress.Commands.add('getCheckbox', { prevSubject: true }, getCheckbox)
Cypress.Commands.add('hasRadios', { prevSubject: true }, hasRadios)
Cypress.Commands.add('hasCheckboxes', { prevSubject: true }, hasCheckboxes)
Cypress.Commands.add('enterDate', { prevSubject: true }, enterDate)

// summary
Cypress.Commands.add('getSummary', getSummary)
Cypress.Commands.add('clickChange', { prevSubject: true }, clickChange)
Cypress.Commands.add('getAnswer', { prevSubject: true }, getAnswer)
Cypress.Commands.add('hasSecondaryAnswer', { prevSubject: true }, hasSecondaryAnswer)
Cypress.Commands.add('hasNoSecondaryAnswer', { prevSubject: true }, hasNoSecondaryAnswer)
