import { markAsComplete, saveAndContinue } from './commands/assessment'
import { enterSubsection, enterBackgroundSubsection, enterPractitionerAnalysisSubsection } from './commands/subsections'
import {
  assertBackLinkIs,
  assertDrugQuestionUrl,
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
  isDisabled,
  isNotDisabled,
  hasDisabledConditionalQuestion,
} from './commands/option'
import {
  assertQuestionCount,
  assessmentMarkedAsComplete,
  assessmentNotMarkedAsComplete,
  currentSectionMarkedAsComplete,
  currentSectionNotMarkedAsComplete,
  hasAutosaveEnabled,
  hasFeedbackLink,
  hasSubheading,
  sectionMarkedAsComplete,
  sectionNotMarkedAsComplete,
} from './commands/page'
import {
  completePrivacyDeclaration,
  enterDate,
  enterText,
  getCheckbox,
  getDrugQuestion,
  getFollowingDetails,
  getNextQuestion,
  getQuestion,
  getRadio,
  hasCheckboxes,
  hasDate,
  hasDrugQuestionGroups,
  hasHiddenCheckbox,
  hasHint,
  hasLimit,
  hasNoValidationError,
  hasQuestionsForDrug,
  hasRadios,
  hasText,
  hasTitle,
  hasValidationError,
  isQuestionNumber,
  selectOption,
} from './commands/question'
import {
  changeDrug,
  clickChange,
  getAnswer,
  getCollectionEntry,
  getDrugSummaryCard,
  getSummary,
  hasCardItems,
  getCardItem,
  hasCardItemAnswers,
  hasCollectionEntries,
  hasNoSecondaryAnswer,
  hasSecondaryAnswer,
} from './commands/summary'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-axe'
import { checkAccessibility } from './commands/accessibility'
import {
  clickChangeAnalysis,
  getAnalysisAnswer,
  getAnalysisSummary,
  hasNoSecondaryAnalysisAnswer,
  hasSecondaryAnalysisAnswer,
} from './commands/analysisSummary'
import {
  AccessMode,
  AssessmentContext,
  captureAssessment,
  cloneCapturedAssessment,
  createAssessment,
  createAssessmentWithVersions,
  enterAssessment,
  lockAssessment,
  softDeleteAssessment,
} from './commands/api'
import { Fixture, loadFixture, saveAsFixture } from './commands/fixture'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      // accessibility
      checkAccessibility(): Chainable

      // API
      createAssessment(): Chainable
      createAssessmentWithVersions(numberOfVersions: number): Chainable
      captureAssessment(): Chainable
      cloneCapturedAssessment(): Chainable
      enterAssessment(
        accessMode?: AccessMode,
        assessmentContextOverride?: AssessmentContext,
        completePrivacyDeclaration?: boolean,
      ): Chainable
      lockAssessment(): Chainable
      softDeleteAssessment(versionFrom: number): Chainable

      // Data Privacy Declaration
      completePrivacyDeclaration(): Chainable

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
      assertBackLinkIs(path: string): Chainable
      assertResumeUrlIs(section: string, subsection: string, path: string): Chainable
      assertStepUrlIs(path: string): Chainable
      assertStepUrlIsNot(path: string): Chainable
      assertQuestionUrl(question: string): Chainable
      assertDrugQuestionUrl(drug: string, question: string): Chainable

      // subsections
      enterSubsection(subsectionName: string): Chainable
      enterBackgroundSubsection(): Chainable
      enterPractitionerAnalysisSubsection(): Chainable

      // option
      isChecked(): Chainable
      isNotChecked(): Chainable
      isDisabled(): Chainable
      isNotDisabled(): Chainable
      isOptionNumber(position: number): Chainable
      clickLabel(): Chainable
      hasConditionalQuestion(expect?: boolean): Chainable
      hasDisabledConditionalQuestion(): Chainable
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
      hasFeedbackLink(): Chainable
      hasSubheading(subheading: string, expected: boolean): Chainable

      // question
      getQuestion(title: string): Chainable
      getNextQuestion(title: string): Chainable
      getDrugQuestion(drug: string, title: string): Chainable
      hasDrugQuestionGroups(count: number): Chainable
      hasQuestionsForDrug(drug: string, count: number): Chainable
      hasTitle(title: string): Chainable
      isQuestionNumber(position: number): Chainable
      hasHint(...hints: string[]): Chainable
      hasLimit(limit: number): Chainable
      hasRadios(options: string[]): Chainable
      hasCheckboxes(options: string[]): Chainable
      hasHiddenCheckbox(label: string): Chainable
      hasValidationError(message: string): Chainable
      hasNoValidationError(): Chainable
      getRadio(label: string): Chainable
      getCheckbox(label: string): Chainable
      getFollowingDetails(): Chainable
      enterText(value: string): Chainable
      enterDate(date: string): Chainable
      hasText(value: string): Chainable
      hasDate(value: string): Chainable
      selectOption(option: string): Chainable

      // summary
      getSummary(question: string): Chainable
      getDrugSummaryCard(drug: string, lastUsed: string): Chainable
      hasCardItems(count: number): Chainable
      getCardItem(key: string): Chainable
      hasCardItemAnswers(...answers: string[]): Chainable
      getCollectionEntry(subject: string, id: number): Chainable
      hasCollectionEntries(subject: string, count: number): Chainable
      hasFrequency(answer: string): Chainable
      hasPreviousUse(answer: string): Chainable
      hasReceivingTreatmentCurrently(answer: string): Chainable
      hasReceivingTreatmentPreviously(answer: string): Chainable
      hasInjectedCurrently(answer: string): Chainable
      hasInjectedPreviously(answer: string): Chainable
      clickChange(): Chainable
      changeDrug(): Chainable
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
Cypress.Commands.add('createAssessmentWithVersions', createAssessmentWithVersions)
Cypress.Commands.add('captureAssessment', captureAssessment)
Cypress.Commands.add('cloneCapturedAssessment', cloneCapturedAssessment)
Cypress.Commands.add('enterAssessment', enterAssessment)
Cypress.Commands.add('lockAssessment', lockAssessment)
Cypress.Commands.add('softDeleteAssessment', softDeleteAssessment)

// Data Privacy Declaration
Cypress.Commands.add('completePrivacyDeclaration', completePrivacyDeclaration)

// Subsection navigation
Cypress.Commands.add('enterSubsection', enterSubsection)
Cypress.Commands.add('enterBackgroundSubsection', enterBackgroundSubsection)
Cypress.Commands.add('enterPractitionerAnalysisSubsection', enterPractitionerAnalysisSubsection)

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
Cypress.Commands.add('assertBackLinkIs', assertBackLinkIs)
Cypress.Commands.add('assertStepUrlIs', assertStepUrlIs)
Cypress.Commands.add('assertStepUrlIsNot', assertStepUrlIsNot)
Cypress.Commands.add('assertQuestionUrl', assertQuestionUrl)
Cypress.Commands.add('assertDrugQuestionUrl', assertDrugQuestionUrl)

// option
Cypress.Commands.add('isChecked', { prevSubject: true }, isChecked)
Cypress.Commands.add('isNotChecked', { prevSubject: true }, isNotChecked)
Cypress.Commands.add('isDisabled', { prevSubject: true }, isDisabled)
Cypress.Commands.add('isNotDisabled', { prevSubject: true }, isNotDisabled)
Cypress.Commands.add('isOptionNumber', { prevSubject: true }, isOptionNumber)
Cypress.Commands.add('clickLabel', { prevSubject: true }, clickLabel)
Cypress.Commands.add('hasConditionalQuestion', { prevSubject: true }, hasConditionalQuestion)
Cypress.Commands.add('hasDisabledConditionalQuestion', { prevSubject: true }, hasDisabledConditionalQuestion)
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
Cypress.Commands.add('hasFeedbackLink', hasFeedbackLink)
Cypress.Commands.add('hasSubheading', hasSubheading)

// question
Cypress.Commands.add('getQuestion', getQuestion)
Cypress.Commands.add('getNextQuestion', { prevSubject: true }, getNextQuestion)
Cypress.Commands.add('getDrugQuestion', getDrugQuestion)
Cypress.Commands.add('hasDrugQuestionGroups', hasDrugQuestionGroups)
Cypress.Commands.add('hasQuestionsForDrug', hasQuestionsForDrug)
Cypress.Commands.add('hasTitle', { prevSubject: true }, hasTitle)
Cypress.Commands.add('isQuestionNumber', { prevSubject: true }, isQuestionNumber)
Cypress.Commands.add('hasHint', { prevSubject: true }, hasHint)
Cypress.Commands.add('hasLimit', { prevSubject: true }, hasLimit)
Cypress.Commands.add('hasValidationError', { prevSubject: true }, hasValidationError)
Cypress.Commands.add('hasNoValidationError', { prevSubject: true }, hasNoValidationError)
Cypress.Commands.add('getRadio', { prevSubject: true }, getRadio)
Cypress.Commands.add('getCheckbox', { prevSubject: true }, getCheckbox)
Cypress.Commands.add('getFollowingDetails', { prevSubject: true }, getFollowingDetails)
Cypress.Commands.add('hasRadios', { prevSubject: true }, hasRadios)
Cypress.Commands.add('hasCheckboxes', { prevSubject: true }, hasCheckboxes)
Cypress.Commands.add('hasHiddenCheckbox', { prevSubject: true }, hasHiddenCheckbox)
Cypress.Commands.add('enterText', { prevSubject: true }, enterText)
Cypress.Commands.add('enterDate', { prevSubject: true }, enterDate)
Cypress.Commands.add('hasText', { prevSubject: true }, hasText)
Cypress.Commands.add('hasDate', { prevSubject: true }, hasDate)
Cypress.Commands.add('selectOption', { prevSubject: true }, selectOption)

// summary
Cypress.Commands.add('getSummary', getSummary)
Cypress.Commands.add('getDrugSummaryCard', getDrugSummaryCard)
Cypress.Commands.add('hasCardItems', { prevSubject: true }, hasCardItems)
Cypress.Commands.add('getCardItem', { prevSubject: true }, getCardItem)
Cypress.Commands.add('hasCardItemAnswers', { prevSubject: true }, hasCardItemAnswers)
Cypress.Commands.add('getCollectionEntry', getCollectionEntry)
Cypress.Commands.add('hasCollectionEntries', hasCollectionEntries)
Cypress.Commands.add('clickChange', { prevSubject: true }, clickChange)
Cypress.Commands.add('changeDrug', { prevSubject: true }, changeDrug)
Cypress.Commands.add('getAnswer', { prevSubject: true }, getAnswer)
Cypress.Commands.add('hasSecondaryAnswer', { prevSubject: true }, hasSecondaryAnswer)
Cypress.Commands.add('hasNoSecondaryAnswer', { prevSubject: true }, hasNoSecondaryAnswer)

// take full-page screenshots on failure
Cypress.Screenshot.defaults({ capture: 'fullPage' })
