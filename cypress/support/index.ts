import { markAsComplete, saveAndContinue } from './commands/assessment'
import {
  assertDrugQuestionGroupUrl,
  assertQuestionUrl,
  assertResumeUrlIs,
  assertSectionIs,
  assertStepUrlIs,
  assertStepUrlIsNot,
  visitSection,
  visitStep,
} from './commands/navigation'
import {
  getConditionalQuestion,
  hasConditionalQuestion,
  isChecked,
  isNotChecked,
  isOptionNumber,
  clickLabel,
  getNthConditionalQuestion,
} from './commands/option'
import {
  assertQuestionCount,
  assessmentMarkedAsComplete,
  assessmentNotMarkedAsComplete,
  currentSectionMarkedAsComplete,
  currentSectionNotMarkedAsComplete,
  hasAutosaveEnabled,
  sectionMarkedAsComplete,
  sectionNotMarkedAsComplete,
} from './commands/page'
import {
  enterDate,
  enterText,
  getCheckbox,
  getDrugQuestion,
  getNextQuestion,
  getQuestion,
  getRadio,
  hasCheckboxes,
  hasDate,
  hasDrugQuestionGroups,
  hasHint,
  hasLimit,
  hasNoValidationError,
  hasQuestionsForDrug,
  hasRadios,
  hasText,
  hasTitle,
  hasValidationError,
  isQuestionNumber,
} from './commands/question'
import {
  changeDrugUsage,
  clickChange,
  getAnswer,
  getDrugSummary,
  getSummary,
  hasFrequency,
  hasInjectedCurrently,
  hasInjectedPreviously,
  hasNoSecondaryAnswer,
  hasPreviousUse,
  hasReceivingTreatmentCurrently,
  hasReceivingTreatmentPreviously,
  hasSecondaryAnswer,
} from './commands/summary'
import 'cypress-axe'
import { checkAccessibility } from './commands/accessibility'
import {
  clickChangeAnalysis,
  getAnalysisAnswer,
  getAnalysisSummary,
  hasNoSecondaryAnalysisAnswer,
  hasSecondaryAnalysisAnswer,
} from './commands/analysisSummary'
import { captureAssessment, cloneCapturedAssessment, createAssessment, enterAssessment } from './commands/api'
import { Fixture, loadFixture, saveAsFixture } from './commands/fixture'

declare global {
  namespace Cypress {
    interface Chainable {
      // accessibility
      checkAccessibility(): Chainable

      // API
      createAssessment(): Chainable
      captureAssessment(): Chainable
      cloneCapturedAssessment(): Chainable
      enterAssessment(): Chainable

      // analysis summary
      getAnalysisSummary(question: string): Chainable
      clickChangeAnalysis(): Chainable
      getAnalysisAnswer(answer: string): Chainable
      hasSecondaryAnalysisAnswer(...lines: string[]): Chainable
      hasNoSecondaryAnalysisAnswer(): Chainable

      // assessment
      saveAndContinue(): Chainable
      markAsComplete(): Chainable

      // fixtures
      loadFixture(fixture: Fixture): Chainable
      saveAsFixture(fixture: Fixture): Chainable

      // navigation
      visitSection(name: string): Chainable
      assertSectionIs(name: string): Chainable
      visitStep(path: string): Chainable
      assertResumeUrlIs(section: string, path: string): Chainable
      assertStepUrlIs(path: string): Chainable
      assertStepUrlIsNot(path: string): Chainable
      assertQuestionUrl(question: string): Chainable
      assertDrugQuestionGroupUrl(drug: string): Chainable

      // option
      isChecked(): Chainable
      isNotChecked(): Chainable
      isOptionNumber(position: number): Chainable
      clickLabel(): Chainable
      hasConditionalQuestion(expect?: boolean): Chainable
      getConditionalQuestion(): Chainable
      getNthConditionalQuestion(index: number): Chainable

      // page
      assertQuestionCount(count: number): Chainable
      sectionMarkedAsComplete(section: string): Chainable
      sectionNotMarkedAsComplete(section: string): Chainable
      currentSectionMarkedAsComplete(section: string): Chainable
      currentSectionNotMarkedAsComplete(section: string): Chainable
      assessmentMarkedAsComplete(): Chainable
      assessmentNotMarkedAsComplete(): Chainable
      hasAutosaveEnabled(): Chainable

      // question
      getQuestion(title: string): Chainable
      getDrugQuestion(drug: string, title: string): Chainable
      hasDrugQuestionGroups(count: number): Chainable
      hasQuestionsForDrug(drug: string, count: number): Chainable
      getNextQuestion(): Chainable
      hasTitle(title: string): Chainable
      isQuestionNumber(position: number): Chainable
      hasHint(...hints: string[]): Chainable
      hasLimit(limit: number): Chainable
      hasRadios(options: string[]): Chainable
      hasCheckboxes(options: string[]): Chainable
      hasValidationError(message: string): Chainable
      hasNoValidationError(): Chainable
      getRadio(label: string): Chainable
      getCheckbox(label: string): Chainable
      enterText(value: string): Chainable
      enterDate(date: string): Chainable
      hasText(value: string): Chainable
      hasDate(value: string): Chainable

      // summary
      getSummary(question: string): Chainable
      getDrugSummary(drug: string): Chainable
      hasFrequency(answer: string): Chainable
      hasPreviousUse(answer: string): Chainable
      hasReceivingTreatmentCurrently(answer: string): Chainable
      hasReceivingTreatmentPreviously(answer: string): Chainable
      hasInjectedCurrently(answer: string): Chainable
      hasInjectedPreviously(answer: string): Chainable
      clickChange(): Chainable
      changeDrugUsage(): Chainable
      getAnswer(answer: string): Chainable
      hasSecondaryAnswer(...answers: string[]): Chainable
      hasNoSecondaryAnswer(): Chainable
    }
  }
}

// accessibility
Cypress.Commands.add('checkAccessibility', checkAccessibility)

// API
Cypress.Commands.add('createAssessment', createAssessment)
Cypress.Commands.add('captureAssessment', captureAssessment)
Cypress.Commands.add('cloneCapturedAssessment', cloneCapturedAssessment)
Cypress.Commands.add('enterAssessment', enterAssessment)

// analysis summary
Cypress.Commands.add('getAnalysisSummary', getAnalysisSummary)
Cypress.Commands.add('clickChangeAnalysis', { prevSubject: true }, clickChangeAnalysis)
Cypress.Commands.add('getAnalysisAnswer', { prevSubject: true }, getAnalysisAnswer)
Cypress.Commands.add('hasSecondaryAnalysisAnswer', { prevSubject: true }, hasSecondaryAnalysisAnswer)
Cypress.Commands.add('hasNoSecondaryAnalysisAnswer', { prevSubject: true }, hasNoSecondaryAnalysisAnswer)

// assessment
Cypress.Commands.add('saveAndContinue', saveAndContinue)
Cypress.Commands.add('markAsComplete', markAsComplete)

// fixtures
Cypress.Commands.add('loadFixture', loadFixture)
Cypress.Commands.add('saveAsFixture', saveAsFixture)

// navigation
Cypress.Commands.add('visitSection', visitSection)
Cypress.Commands.add('assertSectionIs', assertSectionIs)
Cypress.Commands.add('visitStep', visitStep)
Cypress.Commands.add('assertResumeUrlIs', assertResumeUrlIs)
Cypress.Commands.add('assertStepUrlIs', assertStepUrlIs)
Cypress.Commands.add('assertStepUrlIsNot', assertStepUrlIsNot)
Cypress.Commands.add('assertQuestionUrl', assertQuestionUrl)
Cypress.Commands.add('assertDrugQuestionGroupUrl', assertDrugQuestionGroupUrl)

// option
Cypress.Commands.add('isChecked', { prevSubject: true }, isChecked)
Cypress.Commands.add('isNotChecked', { prevSubject: true }, isNotChecked)
Cypress.Commands.add('isOptionNumber', { prevSubject: true }, isOptionNumber)
Cypress.Commands.add('clickLabel', { prevSubject: true }, clickLabel)
Cypress.Commands.add('hasConditionalQuestion', { prevSubject: true }, hasConditionalQuestion)
Cypress.Commands.add('getConditionalQuestion', { prevSubject: true }, getConditionalQuestion)
Cypress.Commands.add('getNthConditionalQuestion', { prevSubject: true }, getNthConditionalQuestion)

// page
Cypress.Commands.add('assertQuestionCount', assertQuestionCount)
Cypress.Commands.add('sectionMarkedAsComplete', sectionMarkedAsComplete)
Cypress.Commands.add('sectionNotMarkedAsComplete', sectionNotMarkedAsComplete)
Cypress.Commands.add('currentSectionMarkedAsComplete', currentSectionMarkedAsComplete)
Cypress.Commands.add('currentSectionNotMarkedAsComplete', currentSectionNotMarkedAsComplete)
Cypress.Commands.add('assessmentMarkedAsComplete', assessmentMarkedAsComplete)
Cypress.Commands.add('assessmentNotMarkedAsComplete', assessmentNotMarkedAsComplete)
Cypress.Commands.add('hasAutosaveEnabled', hasAutosaveEnabled)

// question
Cypress.Commands.add('getQuestion', getQuestion)
Cypress.Commands.add('getDrugQuestion', getDrugQuestion)
Cypress.Commands.add('hasDrugQuestionGroups', hasDrugQuestionGroups)
Cypress.Commands.add('hasQuestionsForDrug', hasQuestionsForDrug)
Cypress.Commands.add('getNextQuestion', { prevSubject: true }, getNextQuestion)
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
Cypress.Commands.add('enterText', { prevSubject: true }, enterText)
Cypress.Commands.add('enterDate', { prevSubject: true }, enterDate)
Cypress.Commands.add('hasText', { prevSubject: true }, hasText)
Cypress.Commands.add('hasDate', { prevSubject: true }, hasDate)

// summary
Cypress.Commands.add('getSummary', getSummary)
Cypress.Commands.add('getDrugSummary', getDrugSummary)
Cypress.Commands.add('hasFrequency', { prevSubject: true }, hasFrequency)
Cypress.Commands.add('hasPreviousUse', { prevSubject: true }, hasPreviousUse)
Cypress.Commands.add('hasReceivingTreatmentCurrently', { prevSubject: true }, hasReceivingTreatmentCurrently)
Cypress.Commands.add('hasReceivingTreatmentPreviously', { prevSubject: true }, hasReceivingTreatmentPreviously)
Cypress.Commands.add('hasInjectedCurrently', { prevSubject: true }, hasInjectedCurrently)
Cypress.Commands.add('hasInjectedPreviously', { prevSubject: true }, hasInjectedPreviously)
Cypress.Commands.add('clickChange', { prevSubject: true }, clickChange)
Cypress.Commands.add('changeDrugUsage', { prevSubject: true }, changeDrugUsage)
Cypress.Commands.add('getAnswer', { prevSubject: true }, getAnswer)
Cypress.Commands.add('hasSecondaryAnswer', { prevSubject: true }, hasSecondaryAnswer)
Cypress.Commands.add('hasNoSecondaryAnswer', { prevSubject: true }, hasNoSecondaryAnswer)

// take full-page screenshots on failure
Cypress.Screenshot.defaults({ capture: 'fullPage' })
