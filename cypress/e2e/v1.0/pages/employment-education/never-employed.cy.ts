import qualifications from './questions/qualifications'
import skills from './questions/skills'
import difficulties from './questions/difficulties'
import otherResponsibilities from './questions/otherResponsibilities'
import levelOfEducation from './questions/levelOfEducation'
import experienceOfEducation from './questions/experienceOfEducation'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/never-employed', () => {
  const stepUrl = '/never-employed'
  const summaryPage = '/employment-education-summary'
  const questions = [
    otherResponsibilities,
    levelOfEducation,
    qualifications,
    skills,
    difficulties,
    experienceOfEducation,
    wantToMakeChanges,
  ]

  before(() => {
    cy.createAssessment().enterAssessment().completePrivacyDeclaration()
    cy.visitSection('Employment and education')
    cy.getQuestion("What is Sam's current employment status?").getRadio('Currently unavailable for work').clickLabel()
    cy.getQuestion("What is Sam's current employment status?")
      .getRadio('Currently unavailable for work')
      .getConditionalQuestion()
      .getRadio('No, has never been employed')
      .clickLabel()
    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Employment and education', stepUrl)
    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment().completePrivacyDeclaration()
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
