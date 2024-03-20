import qualifications from './questions/qualifications'
import skills from './questions/skills'
import difficulties from './questions/difficulties'
import otherResponsibilities from './questions/otherResponsibilities'
import levelOfEducation from './questions/levelOfEducation'
import experienceOfEducation from './questions/experienceOfEducation'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/never-been-employed', () => {
  const stepUrl = '/never-been-employed'
  const summaryPage = '/employment-education-analysis'
  const questions = [
    otherResponsibilities,
    levelOfEducation,
    qualifications,
    skills,
    difficulties,
    experienceOfEducation,
    wantToMakeChanges,
  ]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Employment and education')
    cy.getQuestion("What is Sam's current employment status?").getRadio('Currently unavailable for work').clickLabel()
    cy.getQuestion("What is Sam's current employment status?")
      .getRadio('Currently unavailable for work')
      .getConditionalQuestion()
      .getRadio('No, has never been employed')
      .clickLabel()
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
