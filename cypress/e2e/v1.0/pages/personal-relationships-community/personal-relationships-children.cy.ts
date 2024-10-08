import currentRelationshipStatus from './questions/currentRelationshipStatus'
import intimateRelationshipsHistory from './questions/intimateRelationshipsHistory'
import intimateRelationshipsChallenges from './questions/intimateRelationshipsChallenges'
import manageParentalResponsibilities from './questions/manageParentalResponsibilities'
import currentFamilyRelationship from './questions/currentFamilyRelationship'
import childhoodExperience from './questions/childhoodExperience'
import childhoodBehaviouralProblems from './questions/childhoodBehaviouralProblems'
import senseOfBelonging from './questions/senseOfBelonging'
import wantToMakeChanges from './questions/wantToMakeChanges'

describe('/personal-relationships-children', () => {
  const stepUrl = '/personal-relationships-children'
  const summaryPage = '/personal-relationships-community-summary'
  const questions = [
    currentRelationshipStatus,
    intimateRelationshipsHistory,
    intimateRelationshipsChallenges,
    manageParentalResponsibilities,
    currentFamilyRelationship,
    childhoodExperience,
    childhoodBehaviouralProblems,
    senseOfBelonging,
    wantToMakeChanges,
  ]

  before(() => {
    cy.createAssessment().enterAssessment()
    cy.visitSection('Personal relationships and community')
    cy.getQuestion("Who are the important people in Sam's life?")
      .getCheckbox('Their children or anyone they have parental responsibilities for')
      .clickLabel()
    cy.saveAndContinue()
    cy.assertStepUrlIs(stepUrl)
    cy.assertResumeUrlIs('Personal relationships and community', stepUrl)
    cy.captureAssessment()
  })

  beforeEach(() => {
    cy.cloneCapturedAssessment().enterAssessment()
    cy.visitStep(stepUrl)
    cy.assertQuestionCount(questions.length)
    cy.hasAutosaveEnabled()
  })

  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })

  it('Should have no accessibility violations', () => {
    cy.checkAccessibility()
  })
})
