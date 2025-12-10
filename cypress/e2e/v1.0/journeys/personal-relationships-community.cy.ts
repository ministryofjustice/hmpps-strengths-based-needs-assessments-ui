import { testPractitionerAnalysis } from './common'

describe(`Origin: /personal-relationships-children-information`, () => {
  const destinations = {
    landingPage: '/personal-relationships-children-information',
    personalRelationships: '/personal-relationships',
    personalRelationshipsChildren: '/personal-relationships-children',
    personalRelationshipsCommunity: '/personal-relationships-community',
    backgroundSummary: '/personal-relationships-community-summary',
    analysis: '/personal-relationships-community-analysis',
    analysisSummary: '/personal-relationships-community-analysis-summary',
  }

  const sectionName = 'Personal relationships and community'
  const backgroundSubsectionName = `${sectionName} background`
  const practitionerAnalysisSubsectionName = 'Practitioner analysis'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.personalRelationships}`, () => {
    it(`Landing page routes to "${destinations.personalRelationships}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion("Are there any children in Sam's life?")
        .getCheckbox("No, there are no children in Sam's life")
        .clickLabel()
      cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.personalRelationships)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.personalRelationships)
    })

    describe(`Destination: ${destinations.personalRelationshipsChildren}`, () => {
      it(`Has parental responsibilities routes to "${destinations.personalRelationshipsChildren}"`, () => {
        cy.visitStep(destinations.personalRelationships)
        cy.getQuestion("Who are the important people in Sam's life?")
          .getCheckbox('Their children or anyone they have parenting responsibilities for')
          .clickLabel()
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.personalRelationships)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.personalRelationshipsChildren)
        cy.assertBackLinkIs(destinations.personalRelationships)
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.personalRelationshipsChildren)
      })

      describe(`Destination: ${destinations.backgroundSummary}`, () => {
        it(`routes to "${destinations.backgroundSummary}"`, () => {
          cy.visitStep(destinations.personalRelationshipsChildren)
          cy.getQuestion('Is Sam happy with their current relationship status?')
            .getRadio('Has some concerns about their relationship status but is overall happy')
            .clickLabel()
          cy.getQuestion("What is Sam's history of intimate relationships?")
            .getRadio('History of both positive and negative relationships')
            .clickLabel()
          cy.getQuestion('Is Sam able to resolve any challenges in their intimate relationships?').enterText('test')
          cy.getQuestion('Is Sam able to manage their parenting responsibilities?').getRadio('Unknown').clickLabel()
          cy.getQuestion("What is Sam's current relationship like with their family?").getRadio('Unknown').clickLabel()
          cy.getQuestion("What was Sam's experience of their childhood?").getRadio('Positive experience').clickLabel()
          cy.getQuestion('Did Sam have any childhood behavioural problems?').getRadio('No').clickLabel()
          cy.getQuestion('Does Sam want to make changes to their personal relationships and community?')
            .getRadio('Not applicable')
            .clickLabel()
          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.personalRelationshipsChildren)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.backgroundSummary)
          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.backgroundSummary)
        })

        testPractitionerAnalysis(
          sectionName,
          destinations.backgroundSummary,
          practitionerAnalysisSubsectionName,
          destinations.analysisSummary,
        )
      })
    })

    describe(`Destination: ${destinations.personalRelationshipsCommunity}`, () => {
      it(`"No parental responsibilities routes to "${destinations.personalRelationshipsCommunity}"`, () => {
        cy.visitStep(destinations.personalRelationships)
        cy.getQuestion("Who are the important people in Sam's life?")
          .getCheckbox('Their children or anyone they have parenting responsibilities for')
          .isChecked()
          .clickLabel()
        cy.getQuestion("Who are the important people in Sam's life?").getCheckbox('Friends').clickLabel()
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.personalRelationships)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.personalRelationshipsCommunity)
        cy.assertBackLinkIs(destinations.personalRelationships)
        cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.personalRelationshipsCommunity)
      })

      describe(`Destination: ${destinations.backgroundSummary}`, () => {
        it(`routes to "${destinations.backgroundSummary}"`, () => {
          cy.visitStep(destinations.personalRelationshipsCommunity)
          cy.getQuestion('Is Sam happy with their current relationship status?')
            .getRadio('Has some concerns about their relationship status but is overall happy')
            .clickLabel()
          cy.getQuestion("What is Sam's history of intimate relationships?")
            .getRadio('History of both positive and negative relationships')
            .clickLabel()
          cy.getQuestion('Is Sam able to resolve any challenges in their intimate relationships?').enterText('test')
          cy.getQuestion("What is Sam's current relationship like with their family?").getRadio('Unknown').clickLabel()
          cy.getQuestion("What was Sam's experience of their childhood?").getRadio('Positive experience').clickLabel()
          cy.getQuestion('Did Sam have any childhood behavioural problems?').getRadio('No').clickLabel()
          cy.getQuestion('Does Sam want to make changes to their personal relationships and community?')
            .getRadio('Not applicable')
            .clickLabel()
          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.personalRelationshipsCommunity)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.backgroundSummary)
          cy.assertResumeUrlIs(sectionName, backgroundSubsectionName, destinations.backgroundSummary)
        })

        testPractitionerAnalysis(
          sectionName,
          destinations.backgroundSummary,
          practitionerAnalysisSubsectionName,
          destinations.analysisSummary,
        )
      })
    })
  })
})
