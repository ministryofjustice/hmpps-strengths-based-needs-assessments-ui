import qualifications from './questions/qualifications'
import skills from './questions/skills'
import difficulties from './questions/difficulties'
import employmentHistory from './questions/employmentHistory'
import levelOfEducation from './questions/levelOfEducation'
import wantToMakeChanges from './questions/wantToMakeChanges'
import { Fixture } from '../../../../../support/commands/fixture'

describe('/retired-prison', () => {
  const stepUrl = '/retired-prison'
  const summaryPage = '/employment-education-summary'
  const questions = [employmentHistory, levelOfEducation, qualifications, skills, difficulties, wantToMakeChanges]

  before(() => {
    cy.loadFixture(Fixture.PrisonPathway).enterAssessment()
    cy.visitSection('Employment and education')
    cy.getQuestion("What was Sam's employment status before custody?").getRadio('Retired').clickLabel()
    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Employment and education', stepUrl)
    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(stepUrl)
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
