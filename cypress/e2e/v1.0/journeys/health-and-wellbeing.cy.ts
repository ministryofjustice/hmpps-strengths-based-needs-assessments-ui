import { testPractitionerAnalysis } from './common'

describe('Origin: /health-wellbeing', () => {
  const destinations = {
    landingPage: '/health-wellbeing',
    physicalAndMentalHealthCondition: '/physical-and-mental-health-condition',
    physicalHealthCondition: '/physical-health-condition',
    mentalHealthCondition: '/mental-health-condition',
    noPhysicalAndMentalHealthCondition: '/no-physical-or-mental-health-condition',
    analysis: '/health-wellbeing-analysis',
    analysisComplete: '/health-wellbeing-analysis-complete',
  }

  const sectionName = 'Health and wellbeing'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.physicalAndMentalHealthCondition}`, () => {
    Array.of('Yes').forEach(physicalHealthCondition => {
      Array.of(
        'Yes, ongoing - severe and documented over a prolonged period of time',
        'Yes, ongoing - duration is not known or there is no link to offending',
        'Yes, in the past',
      ).forEach(mentalHealthCondition => {
        it(`Physical health condition: "${physicalHealthCondition}" and Mental health condition: "${mentalHealthCondition}" routes to "${destinations.physicalAndMentalHealthCondition}"`, () => {
          cy.visitStep(destinations.landingPage)

          cy.getQuestion('Does Sam have any physical health conditions?').getRadio(physicalHealthCondition).clickLabel()

          cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?')
            .getRadio(mentalHealthCondition)
            .clickLabel()

          cy.saveAndContinue()

          cy.assertStepUrlIs(destinations.physicalAndMentalHealthCondition)
          cy.assertResumeUrlIs(sectionName, destinations.physicalAndMentalHealthCondition)
        })
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.physicalAndMentalHealthCondition)

        cy.getQuestion('Is Sam currently having psychiatric treatment?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam had a head injury or any illness affecting the brain?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any neurodiverse conditions?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any learning difficulties?').getRadio('No difficulties').clickLabel()

        cy.getQuestion('Is Sam able to cope with day-to-day life?').getRadio('Yes, able to cope well').clickLabel()

        cy.getQuestion("What is Sam's attitude towards themselves?")
          .getRadio('Positive and reasonably happy')
          .clickLabel()

        cy.getQuestion('Has Sam ever self-harmed?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam ever attempted suicide or had suicidal thoughts?').getRadio('No').clickLabel()

        cy.getQuestion('How optimistic is Sam about their future?').getRadio('Sam does not want to answer').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their health and wellbeing?')
          .getRadio('Sam is not present')
          .clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
        cy.assertResumeUrlIs(sectionName, destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.physicalHealthCondition}`, () => {
    Array.of('Yes').forEach(physicalHealthCondition => {
      Array.of('No', 'Unknown').forEach(mentalHealthCondition => {
        it(`Physical health condition: "${physicalHealthCondition}" and Mental health condition: "${mentalHealthCondition}" routes to "${destinations.physicalHealthCondition}"`, () => {
          cy.visitStep(destinations.landingPage)

          cy.getQuestion('Does Sam have any physical health conditions?').getRadio(physicalHealthCondition).clickLabel()

          cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?')
            .getRadio(mentalHealthCondition)
            .clickLabel()

          cy.saveAndContinue()

          cy.assertStepUrlIs(destinations.physicalHealthCondition)
          cy.assertResumeUrlIs(sectionName, destinations.physicalHealthCondition)
        })
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.physicalHealthCondition)

        cy.getQuestion('Has Sam had a head injury or any illness affecting the brain?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any neurodiverse conditions?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any learning difficulties?').getRadio('No difficulties').clickLabel()

        cy.getQuestion('Is Sam able to cope with day-to-day life?').getRadio('Yes, able to cope well').clickLabel()

        cy.getQuestion("What is Sam's attitude towards themselves?")
          .getRadio('Positive and reasonably happy')
          .clickLabel()

        cy.getQuestion('Has Sam ever self-harmed?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam ever attempted suicide or had suicidal thoughts?').getRadio('No').clickLabel()

        cy.getQuestion('How optimistic is Sam about their future?').getRadio('Sam does not want to answer').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their health and wellbeing?')
          .getRadio('Sam is not present')
          .clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
        cy.assertResumeUrlIs(sectionName, destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.mentalHealthCondition}`, () => {
    Array.of('No', 'Unknown').forEach(physicalHealthCondition => {
      Array.of(
        'Yes, ongoing - severe and documented over a prolonged period of time',
        'Yes, ongoing - duration is not known or there is no link to offending',
        'Yes, in the past',
      ).forEach(mentalHealthCondition => {
        it(`Physical health condition: "${physicalHealthCondition}" and Mental health condition: "${mentalHealthCondition}" routes to "${destinations.mentalHealthCondition}"`, () => {
          cy.visitStep(destinations.landingPage)

          cy.getQuestion('Does Sam have any physical health conditions?').getRadio(physicalHealthCondition).clickLabel()

          cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?')
            .getRadio(mentalHealthCondition)
            .clickLabel()

          cy.saveAndContinue()

          cy.assertStepUrlIs(destinations.mentalHealthCondition)
          cy.assertResumeUrlIs(sectionName, destinations.mentalHealthCondition)
        })
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.mentalHealthCondition)

        cy.getQuestion('Is Sam currently having psychiatric treatment?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam had a head injury or any illness affecting the brain?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any neurodiverse conditions?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any learning difficulties?').getRadio('No difficulties').clickLabel()

        cy.getQuestion('Is Sam able to cope with day-to-day life?').getRadio('Yes, able to cope well').clickLabel()

        cy.getQuestion("What is Sam's attitude towards themselves?")
          .getRadio('Positive and reasonably happy')
          .clickLabel()

        cy.getQuestion('Has Sam ever self-harmed?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam ever attempted suicide or had suicidal thoughts?').getRadio('No').clickLabel()

        cy.getQuestion('How optimistic is Sam about their future?').getRadio('Sam does not want to answer').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their health and wellbeing?')
          .getRadio('Sam is not present')
          .clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
        cy.assertResumeUrlIs(sectionName, destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.noPhysicalAndMentalHealthCondition}`, () => {
    Array.of('No', 'Unknown').forEach(physicalHealthCondition => {
      Array.of('No', 'Unknown').forEach(mentalHealthCondition => {
        it(`Physical health condition: "${physicalHealthCondition}" and Mental health condition: "${mentalHealthCondition}" routes to "${destinations.noPhysicalAndMentalHealthCondition}"`, () => {
          cy.visitStep(destinations.landingPage)

          cy.getQuestion('Does Sam have any physical health conditions?').getRadio(physicalHealthCondition).clickLabel()

          cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?')
            .getRadio(mentalHealthCondition)
            .clickLabel()

          cy.saveAndContinue()

          cy.assertStepUrlIs(destinations.noPhysicalAndMentalHealthCondition)
          cy.assertResumeUrlIs(sectionName, destinations.noPhysicalAndMentalHealthCondition)
        })
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.noPhysicalAndMentalHealthCondition)

        cy.getQuestion('Has Sam had a head injury or any illness affecting the brain?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any neurodiverse conditions?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any learning difficulties?').getRadio('No difficulties').clickLabel()

        cy.getQuestion('Is Sam able to cope with day-to-day life?').getRadio('Yes, able to cope well').clickLabel()

        cy.getQuestion("What is Sam's attitude towards themselves?")
          .getRadio('Positive and reasonably happy')
          .clickLabel()

        cy.getQuestion('Has Sam ever self-harmed?').getRadio('No').clickLabel()

        cy.getQuestion('Has Sam ever attempted suicide or had suicidal thoughts?').getRadio('No').clickLabel()

        cy.getQuestion('How optimistic is Sam about their future?').getRadio('Sam does not want to answer').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their health and wellbeing?')
          .getRadio('Sam is not present')
          .clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
        cy.assertResumeUrlIs(sectionName, destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })
})
