import employmentAreaPrison from './questions/employmentArea'
import employmentHistory from './questions/employmentHistory'
import levelOfEducation from './questions/levelOfEducation'
import qualifications from './questions/qualifications'
import skills from './questions/skills'
import experienceOfEmployment from './questions/experienceOfEmployment'
import experienceOfEducation from './questions/experienceOfEducation'
import wantToMakeChanges from './questions/wantToMakeChanges'
import { Fixture } from '../../../../../support/commands/fixture'
import difficulties from '../../employment-education/questions/difficulties'

describe('/employed-prison', () => {
  const stepUrl = '/employed-prison'
  const summaryPage = '/employment-education-summary'
  const questions = [
    employmentAreaPrison,
    employmentHistory,
    levelOfEducation,
    qualifications,
    skills,
    difficulties,
    experienceOfEmployment,
    experienceOfEducation,
    wantToMakeChanges,
  ]

  before(() => {
    cy.loadFixture(Fixture.PrisonPathway).enterAssessment()
    cy.visitSection('Employment and education')
    cy.getQuestion("What was Sam's employment status before custody?").getRadio('Employed').clickLabel()
    cy.getQuestion("What was Sam's employment status before custody?")
      .getRadio('Employed')
      .getConditionalQuestion()
      .getRadio('Full-time')
      .clickLabel()
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
