import { assertVictimEntry } from './questions/victim/summary'
import utils from './questions/victim/utils'
import victimAge from './questions/victim/victimAge'
import victimRaceOrEthnicity from './questions/victim/victimRaceOrEthnicity'
import victimRelationship from './questions/victim/victimRelationship'
import victimSex from './questions/victim/victimSex'

describe('/offence-analysis-victim/create', () => {
  const createUrl = '/offence-analysis-victim/create'
  const editUrl = '/offence-analysis-victim/edit/0'
  const collectionSummaryUrl = '/offence-analysis-victims-summary'
  const summaryUrl = '/offence-analysis-complete'

  const questions = [
    victimRelationship.testCreate,
    victimAge.testCreate,
    victimSex.testCreate,
    victimRaceOrEthnicity.testCreate,
  ]

  const initial = {
    relationship: 'A stranger',
    age: '26 to 49 years',
    sex: 'Male',
    raceOrEthnicityPartial: 'English',
    raceOrEthnicity: 'White - English, Welsh, Scottish, Northern Irish or British',
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
    cy.assertStepUrlIs(createUrl)

    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(createUrl)
    cy.assertQuestionCount(questions.length)
  })

  questions.forEach((questionTest, index) => {
    questionTest(createUrl, editUrl, index + 1)
  })

  it('Should create a victim', () => {
    cy.assertStepUrlIs(createUrl)

    utils.enterVictimDetailsWith(initial)

    cy.assertStepUrlIs(collectionSummaryUrl)

    assertVictimEntry(1, initial)

    cy.visitStep(summaryUrl)
    assertVictimEntry(1, initial)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})