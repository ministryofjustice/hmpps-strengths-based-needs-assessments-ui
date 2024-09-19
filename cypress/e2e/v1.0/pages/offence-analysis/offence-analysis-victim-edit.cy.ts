import { assertVictimEntry } from './questions/victim/summary'
import utils from './questions/victim/utils'
import victimAge from './questions/victim/victimAge'
import victimRaceOrEthnicity from './questions/victim/victimRaceOrEthnicity'
import victimRelationship from './questions/victim/victimRelationship'
import victimSex from './questions/victim/victimSex'

describe('/offence-analysis-victim/edit/:entryId', () => {
  const editUrl = '/offence-analysis-victim/edit/0'
  const collectionSummaryUrl = '/offence-analysis-victim-details'
  const summaryUrl = '/offence-analysis-summary'

  const questions = [
    victimRelationship.testEdit,
    victimAge.testEdit,
    victimSex.testEdit,
    victimRaceOrEthnicity.testEdit,
  ]

  const initial = {
    relationship: 'A stranger',
    age: '26 to 49 years',
    sex: 'Male',
    raceOrEthnicityPartial: 'English',
    raceOrEthnicity: 'White - English, Welsh, Scottish, Northern Irish or British',
  }

  const updated = {
    relationship: "Victim's ex-partner",
    age: '21 to 25 years',
    sex: 'Female',
    raceOrEthnicityPartial: 'Any other White background',
    raceOrEthnicity: 'White - Any other White background',
  }

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Offence analysis')

    cy.getQuestion('Enter a brief description of the current index offence(s)').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Did the current index offence(s) have any of the following elements?')
      .getCheckbox('Arson')
      .clickLabel()
    cy.getQuestion('Why did the current index offence(s) happen?').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Did the current index offence(s) involve any of the following motivations?')
      .getCheckbox('Thrill seeking')
      .clickLabel()
    cy.getQuestion('Who was the victim?').getCheckbox('One or more person').clickLabel()

    cy.saveAndContinue()

    utils.enterVictimDetailsWith(initial)

    cy.assertStepUrlIs(collectionSummaryUrl)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(collectionSummaryUrl)
    cy.assertQuestionCount(1)

    cy.hasCollectionEntries('Victims', 1)

    assertVictimEntry(1, initial)
    cy.getCollectionEntry('victim', 1).contains('a', 'Change').click()
  })

  questions.forEach((questionTest, index) => {
    questionTest(editUrl, collectionSummaryUrl, index + 1)
  })

  it('updates the assessment entry', () => {
    utils.enterVictimDetailsWith(updated)
    cy.assertStepUrlIs(collectionSummaryUrl)

    assertVictimEntry(1, updated)

    cy.visitStep(summaryUrl)
    assertVictimEntry(1, updated)
  })
})
