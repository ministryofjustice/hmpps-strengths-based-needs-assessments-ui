import qualifications from './questions/qualifications'
import skills from './questions/skills'
import difficulties from './questions/difficulties'
import employmentHistory from './questions/employmentHistory'
import otherResponsibilities from './questions/otherResponsibilities'
import levelOfEducation from './questions/levelOfEducation'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/retired', () => {
  const stepUrl = '/retired'
  const summaryPage = '/employment-education-analysis'
  const questions = [
    employmentHistory,
    otherResponsibilities,
    levelOfEducation,
    qualifications,
    skills,
    difficulties,
    wantToMakeChanges,
  ]

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Employment and education')
    cy.getQuestion("What is Sam's current employment status?").getRadio('Retired').clickLabel()
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
