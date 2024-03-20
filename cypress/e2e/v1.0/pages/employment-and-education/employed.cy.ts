import qualifications from './questions/qualifications'
import skills from './questions/skills'
import difficulties from './questions/difficulties'
import employmentArea from './questions/employmentArea'
import employmentHistory from './questions/employmentHistory'
import otherResponsibilities from './questions/otherResponsibilities'
import levelOfEducation from './questions/levelOfEducation'
import experienceOfEmployment from './questions/experienceOfEmployment'
import experienceOfEducation from './questions/experienceOfEducation'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/employed', () => {
  const stepUrl = '/employed'
  const summaryPage = '/employment-education-analysis'
  const questions = [
    employmentArea,
    employmentHistory,
    otherResponsibilities,
    levelOfEducation,
    qualifications,
    skills,
    difficulties,
    experienceOfEmployment,
    experienceOfEducation,
    wantToMakeChanges,
  ]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Employment and education')
    cy.getQuestion("What is Sam's current employment status?").getRadio('Employed').clickLabel()
    cy.getQuestion("What is Sam's current employment status?")
      .getRadio('Employed')
      .getConditionalQuestion()
      .getRadio('Full-time')
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
