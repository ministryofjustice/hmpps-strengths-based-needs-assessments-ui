import { testPractitionerAnalysis } from './common'

describe('Origin: /current-employment', () => {
  const destinations = {
    landingPage: '/current-employment',
    employed: '/employed',
    retired: '/retired',
    employedBefore: '/employed-before',
    neverEmployed: '/never-employed',
    summary: '/employment-education-summary',
    analysis: '/employment-education-analysis',
  }

  const sectionName = 'Employment and education'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.employed}`, () => {
    Array.of('Full-time', 'Part-time', 'Temporary or casual', 'Apprenticeship').forEach(typeOfEmployment => {
      it(`"Employed" and "${typeOfEmployment}" routes to "${destinations.employed}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What is Sam's current employment status?").getRadio('Employed').clickLabel()

        cy.getQuestion("What is Sam's current employment status?")
          .getRadio('Employed')
          .getConditionalQuestion()
          .getRadio(typeOfEmployment)
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.landingPage)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.employed)
        cy.assertBackLinkIs(destinations.landingPage)
        cy.assertResumeUrlIs(sectionName, destinations.employed)
      })
    })

    it(`"Self-employed" routes to "${destinations.employed}"`, () => {
      cy.visitStep(destinations.landingPage)

      cy.getQuestion("What is Sam's current employment status?").getRadio('Self-employed').clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.employed)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.employed)
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.employed)

        cy.getQuestion("What is Sam's employment history?").getRadio('Continuous employment history').clickLabel()

        cy.getQuestion('Does Sam have any additional day-to-day commitments?').getCheckbox('None').clickLabel()

        cy.getQuestion('Select the highest level of academic qualification Sam has completed')
          .getRadio('Entry level')
          .clickLabel()

        cy.getQuestion('Does Sam have any professional or vocational qualifications?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any skills that could help them in a job or to get a job?')
          .getRadio('No')
          .clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('No difficulties')
          .clickLabel()

        cy.getQuestion("What is Sam's overall experience of employment?").getRadio('Positive').clickLabel()

        cy.getQuestion("What is Sam's experience of education?").getRadio('Positive').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.employed)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })

  describe(`Destination: ${destinations.retired}`, () => {
    it(`"Retired" routes to "${destinations.retired}"`, () => {
      cy.visitStep(destinations.landingPage)

      cy.getQuestion("What is Sam's current employment status?").getRadio('Retired').clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.retired)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.retired)
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.retired)

        cy.getQuestion("What is Sam's employment history?").getRadio('Continuous employment history').clickLabel()

        cy.getQuestion('Does Sam have any additional day-to-day commitments?').getCheckbox('Studying').clickLabel()

        cy.getQuestion('Select the highest level of academic qualification Sam has completed')
          .getRadio('Entry level')
          .clickLabel()

        cy.getQuestion('Does Sam have any professional or vocational qualifications?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any skills that could help them in a job or to get a job?')
          .getRadio('No')
          .clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('Yes, with reading')
          .clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('Yes, with reading')
          .getConditionalQuestion()
          .getRadio('Some difficulties')
          .clickLabel()

        cy.getQuestion('Does Sam want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.retired)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })

  const employmentStatuses = [
    'Currently unavailable for work',
    'Unemployed - actively looking for work',
    'Unemployed - not actively looking for work',
  ]

  describe(`Destination: ${destinations.employedBefore}`, () => {
    employmentStatuses.forEach(employmentStatus => {
      it(`"${employmentStatus}" and "Yes, has been employed before" routes to "${destinations.employedBefore}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What is Sam's current employment status?").getRadio(employmentStatus).clickLabel()

        cy.getQuestion("What is Sam's current employment status?")
          .getRadio(employmentStatus)
          .getConditionalQuestion()
          .getRadio('Yes, has been employed before')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.landingPage)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.employedBefore)
        cy.assertBackLinkIs(destinations.landingPage)
        cy.assertResumeUrlIs(sectionName, destinations.employedBefore)
      })
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.employedBefore)

        cy.getQuestion("What is Sam's employment history?").getRadio('Continuous employment history').clickLabel()

        cy.getQuestion('Does Sam have any additional day-to-day commitments?').getCheckbox('Volunteering').clickLabel()

        cy.getQuestion('Select the highest level of academic qualification Sam has completed')
          .getRadio('Entry level')
          .clickLabel()

        cy.getQuestion('Does Sam have any professional or vocational qualifications?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any skills that could help them in a job or to get a job?')
          .getRadio('No')
          .clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('Yes, with writing')
          .clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('Yes, with writing')
          .getConditionalQuestion()
          .getRadio('Some difficulties')
          .clickLabel()

        cy.getQuestion("What is Sam's overall experience of employment?").getRadio('Positive').clickLabel()

        cy.getQuestion("What is Sam's experience of education?").getRadio('Positive').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.employedBefore)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })

  describe(`Destination: ${destinations.neverEmployed}`, () => {
    employmentStatuses.forEach(employmentStatus => {
      it(`"${employmentStatus}" and "No, has never been employed" routes to "${destinations.neverEmployed}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What is Sam's current employment status?").getRadio(employmentStatus).clickLabel()

        cy.getQuestion("What is Sam's current employment status?")
          .getRadio(employmentStatus)
          .getConditionalQuestion()
          .getRadio('No, has never been employed')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.landingPage)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.neverEmployed)
        cy.assertBackLinkIs(destinations.landingPage)
        cy.assertResumeUrlIs(sectionName, destinations.neverEmployed)
      })
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.neverEmployed)

        cy.getQuestion('Does Sam have any additional day-to-day commitments?').getCheckbox('Other').clickLabel()

        cy.getQuestion('Select the highest level of academic qualification Sam has completed')
          .getRadio('Entry level')
          .clickLabel()

        cy.getQuestion('Does Sam have any professional or vocational qualifications?').getRadio('No').clickLabel()

        cy.getQuestion('Does Sam have any skills that could help them in a job or to get a job?')
          .getRadio('No')
          .clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('Yes, with numeracy')
          .clickLabel()

        cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
          .getCheckbox('Yes, with numeracy')
          .getConditionalQuestion()
          .getRadio('Some difficulties')
          .clickLabel()

        cy.getQuestion("What is Sam's experience of education?").getRadio('Positive').clickLabel()

        cy.getQuestion('Does Sam want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.neverEmployed)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })
})
