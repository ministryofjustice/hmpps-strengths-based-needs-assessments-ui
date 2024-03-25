import { testPractitionerAnalysis } from './common'

describe('Origin: /employment-education', () => {
  const destinations = {
    landingPage: '/employment-education',
    employed: '/employed',
    retired: '/retired',
    hasBeenEmployed: '/has-been-employed',
    neverBeenEmployed: '/never-been-employed',
    analysis: '/employment-education-analysis',
    analysisComplete: '/employment-education-analysis-complete',
  }

  const sectionName = 'Employment and education'

  describe(`Destination: ${destinations.employed}`, () => {
    before(() => {
      cy.createAssessment()
    })

    Array.of('Full-time', 'Part-time', 'Temporary or casual', 'Apprenticeship').forEach(typeOfEmployment => {
      it(`"Employed" and "${typeOfEmployment}" routes to "${destinations.employed}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What is Sam's current employment status?").getRadio('Employed').clickLabel()

        cy.getQuestion("What is Sam's current employment status?")
          .getRadio('Employed')
          .getConditionalQuestion()
          .getRadio(typeOfEmployment)
          .clickLabel()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.employed)
      })
    })

    it(`"Self-employed" routes to "${destinations.employed}"`, () => {
      cy.visitStep(destinations.landingPage)

      cy.getQuestion("What is Sam's current employment status?").getRadio('Self-employed').clickLabel()

      cy.saveAndContinue()

      cy.assertStepUrlIs(destinations.employed)
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.employed)

        cy.getQuestion("What is Sam's employment history?").getRadio('Continuous employment history').clickLabel()

        cy.getQuestion('Does Sam have any additional day-to-day commitments?').getCheckbox('None').clickLabel()

        cy.getQuestion('Select the highest level of academic qualification Sam has completed')
          .getRadio('Entry level')
          .clickLabel()

        cy.getQuestion('Does Sam have any professional or vocational qualifications?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have skills that could help them in a job or at work?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('No difficulties')
          .clickLabel()

        cy.getQuestion("What is Sam's overall experience of employment?").getRadio('Positive').clickLabel()

        cy.getQuestion("What is Sam's experience of education?").getRadio('Positive').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.retired}`, () => {
    before(() => {
      cy.createAssessment()
    })

    it(`"Retired" routes to "${destinations.retired}"`, () => {
      cy.visitStep(destinations.landingPage)

      cy.getQuestion("What is Sam's current employment status?").getRadio('Retired').clickLabel()

      cy.saveAndContinue()

      cy.assertStepUrlIs(destinations.retired)
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.retired)

        cy.getQuestion("What is Sam's employment history?").getRadio('Continuous employment history').clickLabel()

        cy.getQuestion('Does Sam have any additional day-to-day commitments?').getCheckbox('None').clickLabel()

        cy.getQuestion('Select the highest level of academic qualification Sam has completed')
          .getRadio('Entry level')
          .clickLabel()

        cy.getQuestion('Does Sam have any professional or vocational qualifications?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have skills that could help them in a job or at work?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('No difficulties')
          .clickLabel()

        cy.getQuestion('Does Sam want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  const employmentStatuses = [
    'Currently unavailable for work',
    'Unemployed - actively looking for work',
    'Unemployed - not actively looking for work',
  ]

  describe(`Destination: ${destinations.hasBeenEmployed}`, () => {
    before(() => {
      cy.createAssessment()
    })

    employmentStatuses.forEach(employmentStatus => {
      it(`"${employmentStatus}" and "Yes, has been employed before" routes to "${destinations.hasBeenEmployed}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What is Sam's current employment status?").getRadio(employmentStatus).clickLabel()

        cy.getQuestion("What is Sam's current employment status?")
          .getRadio(employmentStatus)
          .getConditionalQuestion()
          .getRadio('Yes, has been employed before')
          .clickLabel()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.hasBeenEmployed)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.hasBeenEmployed)

        cy.getQuestion("What is Sam's employment history?").getRadio('Continuous employment history').clickLabel()

        cy.getQuestion('Does Sam have any additional day-to-day commitments?').getCheckbox('None').clickLabel()

        cy.getQuestion('Select the highest level of academic qualification Sam has completed')
          .getRadio('Entry level')
          .clickLabel()

        cy.getQuestion('Does Sam have any professional or vocational qualifications?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have skills that could help them in a job or at work?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('No difficulties')
          .clickLabel()

        cy.getQuestion("What is Sam's overall experience of employment?").getRadio('Positive').clickLabel()

        cy.getQuestion("What is Sam's experience of education?").getRadio('Positive').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })

  describe(`Destination: ${destinations.neverBeenEmployed}`, () => {
    before(() => {
      cy.createAssessment()
    })

    employmentStatuses.forEach(employmentStatus => {
      it(`"${employmentStatus}" and "No, has never been employed" routes to "${destinations.neverBeenEmployed}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What is Sam's current employment status?").getRadio(employmentStatus).clickLabel()

        cy.getQuestion("What is Sam's current employment status?")
          .getRadio(employmentStatus)
          .getConditionalQuestion()
          .getRadio('No, has never been employed')
          .clickLabel()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.neverBeenEmployed)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.neverBeenEmployed)

        cy.getQuestion('Does Sam have any additional day-to-day commitments?').getCheckbox('None').clickLabel()

        cy.getQuestion('Select the highest level of academic qualification Sam has completed')
          .getRadio('Entry level')
          .clickLabel()

        cy.getQuestion('Does Sam have any professional or vocational qualifications?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have skills that could help them in a job or at work?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('No difficulties')
          .clickLabel()

        cy.getQuestion("What is Sam's experience of education?").getRadio('Positive').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .clickLabel()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })

      testPractitionerAnalysis(sectionName, destinations.analysis, destinations.analysisComplete)
    })
  })
})
