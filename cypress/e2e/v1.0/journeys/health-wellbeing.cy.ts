import { testPractitionerAnalysis } from './common'

describe('Origin: /health-wellbeing', () => {
  const destinations = {
    landingPage: '/health-wellbeing',
    physicalMentalHealth: '/physical-mental-health',
    physicalHealth: '/physical-health',
    mentalHealth: '/mental-health',
    noPhysicalMentalHealth: '/no-physical-mental-health',
    summary: '/health-wellbeing-summary',
    analysis: '/health-wellbeing-analysis',
  }

  const sectionName = 'Health and wellbeing'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.physicalMentalHealth}`, () => {
    Array.of('Yes').forEach(physicalHealthCondition => {
      Array.of(
        'Yes, ongoing - severe and documented over a prolonged period of time',
        'Yes, ongoing - duration is not known or there is no link to offending',
        'Yes, in the past',
      ).forEach(mentalHealthCondition => {
        it(`Physical health condition: "${physicalHealthCondition}" and Mental health condition: "${mentalHealthCondition}" routes to "${destinations.physicalMentalHealth}"`, () => {
          cy.visitStep(destinations.landingPage)

          cy.getQuestion('Does Sam have any physical health conditions?').getRadio(physicalHealthCondition).clickLabel()

          cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?')
            .getRadio(mentalHealthCondition)
            .clickLabel()

          cy.assertResumeUrlIs(sectionName, destinations.landingPage)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.physicalMentalHealth)
          cy.assertBackLinkIs(destinations.landingPage)
          cy.assertResumeUrlIs(sectionName, destinations.physicalMentalHealth)
        })
      })
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.physicalMentalHealth)

        cy.getQuestion('Is Sam currently having psychiatric treatment?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam had a head injury or any illness affecting the brain?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any neurodiverse conditions?').getRadio('No').clickLabel()

        cy.getQuestion('Is Sam able to cope with day-to-day life?').getRadio('Yes, able to cope well').clickLabel()

        cy.getQuestion("What is Sam's attitude towards themselves?")
          .getRadio('Positive and reasonably happy')
          .clickLabel()

        cy.getQuestion('Has Sam ever self-harmed?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam ever attempted suicide or had suicidal thoughts?').getRadio('No').clickLabel()

        cy.getQuestion('How does Sam feel about their future?').getRadio('Sam does not want to answer').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their health and wellbeing?')
          .getRadio('Sam is not present')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.physicalMentalHealth)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })

  describe(`Destination: ${destinations.physicalHealth}`, () => {
    Array.of('Yes').forEach(physicalHealthCondition => {
      Array.of('No', 'Unknown').forEach(mentalHealthCondition => {
        it(`Physical health condition: "${physicalHealthCondition}" and Mental health condition: "${mentalHealthCondition}" routes to "${destinations.physicalHealth}"`, () => {
          cy.visitStep(destinations.landingPage)

          cy.getQuestion('Does Sam have any physical health conditions?').getRadio(physicalHealthCondition).clickLabel()

          cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?')
            .getRadio(mentalHealthCondition)
            .clickLabel()

          cy.assertResumeUrlIs(sectionName, destinations.landingPage)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.physicalHealth)
          cy.assertBackLinkIs(destinations.landingPage)
          cy.assertResumeUrlIs(sectionName, destinations.physicalHealth)
        })
      })
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.physicalHealth)

        cy.getQuestion('Has Sam had a head injury or any illness affecting the brain?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any neurodiverse conditions?').getRadio('No').clickLabel()

        cy.getQuestion('Is Sam able to cope with day-to-day life?').getRadio('Yes, able to cope well').clickLabel()

        cy.getQuestion("What is Sam's attitude towards themselves?")
          .getRadio('Positive and reasonably happy')
          .clickLabel()

        cy.getQuestion('Has Sam ever self-harmed?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam ever attempted suicide or had suicidal thoughts?').getRadio('No').clickLabel()

        cy.getQuestion('How does Sam feel about their future?').getRadio('Sam does not want to answer').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their health and wellbeing?')
          .getRadio('Sam is not present')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.physicalHealth)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })

  describe(`Destination: ${destinations.mentalHealth}`, () => {
    Array.of('No', 'Unknown').forEach(physicalHealthCondition => {
      Array.of(
        'Yes, ongoing - severe and documented over a prolonged period of time',
        'Yes, ongoing - duration is not known or there is no link to offending',
        'Yes, in the past',
      ).forEach(mentalHealthCondition => {
        it(`Physical health condition: "${physicalHealthCondition}" and Mental health condition: "${mentalHealthCondition}" routes to "${destinations.mentalHealth}"`, () => {
          cy.visitStep(destinations.landingPage)

          cy.getQuestion('Does Sam have any physical health conditions?').getRadio(physicalHealthCondition).clickLabel()

          cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?')
            .getRadio(mentalHealthCondition)
            .clickLabel()

          cy.assertResumeUrlIs(sectionName, destinations.landingPage)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.mentalHealth)
          cy.assertBackLinkIs(destinations.landingPage)
          cy.assertResumeUrlIs(sectionName, destinations.mentalHealth)
        })
      })
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.mentalHealth)

        cy.getQuestion('Is Sam currently having psychiatric treatment?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam had a head injury or any illness affecting the brain?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any neurodiverse conditions?').getRadio('No').clickLabel()

        cy.getQuestion('Is Sam able to cope with day-to-day life?').getRadio('Yes, able to cope well').clickLabel()

        cy.getQuestion("What is Sam's attitude towards themselves?")
          .getRadio('Positive and reasonably happy')
          .clickLabel()

        cy.getQuestion('Has Sam ever self-harmed?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam ever attempted suicide or had suicidal thoughts?').getRadio('No').clickLabel()

        cy.getQuestion('How does Sam feel about their future?').getRadio('Sam does not want to answer').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their health and wellbeing?')
          .getRadio('Sam is not present')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.mentalHealth)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })

  describe(`Destination: ${destinations.noPhysicalMentalHealth}`, () => {
    Array.of('No', 'Unknown').forEach(physicalHealthCondition => {
      Array.of('No', 'Unknown').forEach(mentalHealthCondition => {
        it(`Physical health condition: "${physicalHealthCondition}" and Mental health condition: "${mentalHealthCondition}" routes to "${destinations.noPhysicalMentalHealth}"`, () => {
          cy.visitStep(destinations.landingPage)

          cy.getQuestion('Does Sam have any physical health conditions?').getRadio(physicalHealthCondition).clickLabel()

          cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?')
            .getRadio(mentalHealthCondition)
            .clickLabel()

          cy.assertResumeUrlIs(sectionName, destinations.landingPage)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.noPhysicalMentalHealth)
          cy.assertBackLinkIs(destinations.landingPage)
          cy.assertResumeUrlIs(sectionName, destinations.noPhysicalMentalHealth)
        })
      })
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.noPhysicalMentalHealth)

        cy.getQuestion('Has Sam had a head injury or any illness affecting the brain?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any neurodiverse conditions?').getRadio('No').clickLabel()

        cy.getQuestion('Is Sam able to cope with day-to-day life?').getRadio('Yes, able to cope well').clickLabel()

        cy.getQuestion("What is Sam's attitude towards themselves?")
          .getRadio('Positive and reasonably happy')
          .clickLabel()

        cy.getQuestion('Has Sam ever self-harmed?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam ever attempted suicide or had suicidal thoughts?').getRadio('No').clickLabel()

        cy.getQuestion('How does Sam feel about their future?').getRadio('Sam does not want to answer').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their health and wellbeing?')
          .getRadio('Sam is not present')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.noPhysicalMentalHealth)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })
})
