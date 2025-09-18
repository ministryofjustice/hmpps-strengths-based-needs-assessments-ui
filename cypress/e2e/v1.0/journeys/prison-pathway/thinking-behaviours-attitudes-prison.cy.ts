import { Fixture } from '../../../../support/commands/fixture'

describe(`Origin: /thinking-behaviours-attitudes-prison`, () => {
  const destinations = {
    landingPage: '/thinking-behaviours-attitudes-prison',
    riskOfSexualHarm: '/thinking-behaviours-attitudes-risk-of-sexual-harm',
    riskOfSexualHarmDetails: '/thinking-behaviours-attitudes-risk-of-sexual-harm-details',
    summary: '/thinking-behaviours-attitudes-summary',
    analysis: '/thinking-behaviours-attitudes-analysis',
  }

  const sectionName = 'Thinking, behaviours and attitudes'

  before(() => {
    cy.loadFixture(Fixture.PrisonPathway)
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.riskOfSexualHarm}`, () => {
    it(`routes to "${destinations.riskOfSexualHarm}"`, () => {
      cy.visitStep(destinations.landingPage)
      cy.getQuestion('Is Sam aware of the consequences of their actions?')
        .getRadio('Yes, is aware of the consequences of their actions')
        .clickLabel()
      cy.getQuestion('Does Sam show stable behaviour?').getRadio('Yes, shows stable behaviour').clickLabel()
      cy.getQuestion('Does Sam engage in activities that could link to offending?')
        .getRadio('Engages in pro-social activities and understands the link to offending')
        .clickLabel()
      cy.getQuestion('Is Sam resilient towards peer pressure or influence by criminal associates?')
        .getRadio('Yes, resilient towards peer pressure or influence by criminal associates')
        .clickLabel()
      cy.getQuestion('Is Sam able to solve problems in a positive way?')
        .getRadio('Yes, is able to solve problems and identify appropriate solutions')
        .clickLabel()
      cy.getQuestion("Does Sam understand other people's views?")
        .getRadio(
          "Yes, understands other people's views and is able to distinguish between their own feelings and those of others",
        )
        .clickLabel()
      cy.getQuestion('Does Sam show manipulative behaviour or a predatory lifestyle?')
        .getRadio(
          'Generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle',
        )
        .clickLabel()
      cy.getQuestion('Is Sam able to manage their temper?')
        .getRadio('Yes, is able to manage their temper well')
        .clickLabel()
      cy.getQuestion('Does Sam use violence, aggressive or controlling behaviour to get their own way?')
        .getRadio('Does not use violence, aggressive or controlling behaviour to get their own way')
        .clickLabel()
      cy.getQuestion('Does Sam act on impulse?')
        .getRadio('Considers all aspects of a situation before acting on or making a decision')
        .clickLabel()
      cy.getQuestion(
        'Does Sam generally have a positive attitude towards any criminal justice staff they come into contact with?',
      )
        .getRadio('Yes, has a positive attitude')
        .clickLabel()
      cy.getQuestion('Does Sam have hostile orientation to others or to general rules?')
        .getRadio('Some evidence of suspicious, angry or vengeful thinking and behaviour')
        .clickLabel()
      cy.getQuestion('Does Sam accept their prison sentence?')
        .getRadio('Accepts their sentence and has responded well to prison rules in the past')
        .clickLabel()
      cy.getQuestion('Does Sam support or excuse criminal behaviour?')
        .getRadio('Does not support or excuse criminal behaviour')
        .clickLabel()
      cy.getQuestion('Does Sam want to make changes to their thinking, behaviours and attitudes?')
        .getRadio('Sam is not present')
        .clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.riskOfSexualHarm)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.riskOfSexualHarm)
    })
  })
})
