import { testPractitionerAnalysis } from './common'

describe(`Origin: /thinking-behaviours-attitudes`, () => {
  const destinations = {
    landingPage: '/thinking-behaviours-attitudes',
    sexualOffending: '/thinking-behaviours-attitudes-sexual-offending',
    thinkingBehaviours: '/thinking-behaviours',
    summary: '/thinking-behaviours-attitudes-summary',
    analysis: '/thinking-behaviours-attitudes-analysis',
  }

  const sectionName = 'Thinking, behaviours and attitudes'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.sexualOffending}`, () => {
    it(`Yes, Sam is a risk of sexual harm routes to "${destinations.sexualOffending}"`, () => {
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
      cy.getQuestion('Are there any concerns that Sam poses a risk of sexual harm to others?')
        .getRadio('Yes')
        .clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.sexualOffending)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.sexualOffending)
    })

    describe(`Destination: ${destinations.thinkingBehaviours}`, () => {
      it(`routes to "${destinations.thinkingBehaviours}"`, () => {
        cy.visitStep(destinations.sexualOffending)
        cy.getQuestion('Is there evidence Sam shows sexual preoccupation?').getRadio('Unknown').clickLabel()
        cy.getQuestion('Is there evidence Sam has offence-related sexual interests?').getRadio('Unknown').clickLabel()
        cy.getQuestion('Is there evidence Sam finds it easier to seek emotional intimacy with children over adults?')
          .getRadio('Unknown')
          .clickLabel()
        cy.assertResumeUrlIs(sectionName, destinations.sexualOffending)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.thinkingBehaviours)
        cy.assertBackLinkIs(destinations.sexualOffending)
        cy.assertResumeUrlIs(sectionName, destinations.thinkingBehaviours)
      })

      describe(`Destination: ${destinations.summary}`, () => {
        it(`routes to "${destinations.summary}"`, () => {
          cy.visitStep(destinations.thinkingBehaviours)
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
            'Does Sam have a positive attitude towards any criminal justice staff they have come into contact with?',
          )
            .getRadio('Yes, has a positive attitude')
            .clickLabel()
          cy.getQuestion('Does Sam have hostile orientation to others or to general rules?')
            .getRadio('Some evidence of suspicious, angry or vengeful thinking and behaviour')
            .clickLabel()
          cy.getQuestion('Does Sam accept supervision and their licence conditions?')
            .getRadio('Accepts supervision and has responded well to supervision in the past')
            .clickLabel()
          cy.getQuestion('Does Sam support or excuse criminal behaviour?')
            .getRadio('Does not support or excuse criminal behaviour')
            .clickLabel()
          cy.getQuestion('Does Sam want to make changes to their thinking, behaviours and attitudes?')
            .getRadio('Not applicable')
            .clickLabel()
          cy.assertResumeUrlIs(sectionName, destinations.thinkingBehaviours)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.summary)
          cy.assertResumeUrlIs(sectionName, destinations.summary)
        })

        testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
      })
    })
  })

  describe(`Destination: ${destinations.thinkingBehaviours}`, () => {
    it(`No, Sam is not a risk of sexual harm routes to "${destinations.thinkingBehaviours}"`, () => {
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
      cy.getQuestion('Are there any concerns that Sam poses a risk of sexual harm to others?')
        .getRadio('No')
        .clickLabel()
      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.thinkingBehaviours)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.summary) // no answers changed on the thinkingBehaviours page, therefore resumeUrl should be the summary page
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to "${destinations.summary}"`, () => {
        cy.visitStep(destinations.thinkingBehaviours)
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
          'Does Sam have a positive attitude towards any criminal justice staff they have come into contact with?',
        )
          .getRadio('Yes, has a positive attitude')
          .clickLabel()
        cy.getQuestion('Does Sam have hostile orientation to others or to general rules?')
          .getRadio('Some evidence of suspicious, angry or vengeful thinking and behaviour')
          .clickLabel()
        cy.getQuestion('Does Sam accept supervision and their licence conditions?')
          .getRadio('Accepts supervision and has responded well to supervision in the past')
          .clickLabel()
        cy.getQuestion('Does Sam support or excuse criminal behaviour?')
          .getRadio('Does not support or excuse criminal behaviour')
          .clickLabel()
        cy.getQuestion('Does Sam want to make changes to their thinking, behaviours and attitudes?')
          .getRadio('Sam is not present')
          .clickLabel()
        cy.assertResumeUrlIs(sectionName, destinations.thinkingBehaviours)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })
})
