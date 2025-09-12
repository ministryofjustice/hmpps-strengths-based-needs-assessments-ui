import { testPractitionerAnalysis } from '../common'
import { Fixture } from '../../../../support/commands/fixture'

describe('Origin: /current-employment-prison', () => {
  const destinations = {
    landingPage: '/current-employment-prison',
    employedPrison: '/employed-prison',
    retiredPrison: '/retired-prison',
    employedBeforePrison: '/employed-before-prison',
    neverEmployedPrison: '/never-employed-prison',
    summary: '/employment-education-summary',
    analysis: '/employment-education-analysis',
  }

  const sectionName = 'Employment and education'

  before(() => {
    cy.loadFixture(Fixture.PrisonPathway)
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.employedPrison}`, () => {
    Array.of('Full-time', 'Part-time', 'Temporary or casual', 'Apprenticeship').forEach(typeOfEmployment => {
      it(`"Employed" and "${typeOfEmployment}" routes to "${destinations.employedPrison}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What was Sam's employment status before custody?").getRadio('Employed').clickLabel()

        cy.getQuestion("What was Sam's employment status before custody?")
          .getRadio('Employed')
          .getConditionalQuestion()
          .getRadio(typeOfEmployment)
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.landingPage)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.employedPrison)
        cy.assertBackLinkIs(destinations.landingPage)
        cy.assertResumeUrlIs(sectionName, destinations.employedPrison)
      })
    })

    it(`"Self-employed" routes to "${destinations.employedPrison}"`, () => {
      cy.visitStep(destinations.landingPage)

      cy.getQuestion("What was Sam's employment status before custody?").getRadio('Self-employed').clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.employedPrison)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.employedPrison)
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.employedPrison)

        cy.getQuestion("What was Sam's employment history before custody?")
          .getRadio('Continuous employment history')
          .clickLabel()

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

        cy.assertResumeUrlIs(sectionName, destinations.employedPrison)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })

  describe(`Destination: ${destinations.retiredPrison}`, () => {
    it(`"Retired" routes to "${destinations.retiredPrison}"`, () => {
      cy.visitStep(destinations.landingPage)

      cy.getQuestion("What was Sam's employment status before custody?").getRadio('Retired').clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.retiredPrison)
      cy.assertBackLinkIs(destinations.landingPage)
      cy.assertResumeUrlIs(sectionName, destinations.retiredPrison)
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.retiredPrison)

        cy.getQuestion("What was Sam's employment history before custody?")
          .getRadio('Continuous employment history')
          .clickLabel()

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

        cy.assertResumeUrlIs(sectionName, destinations.retiredPrison)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })

  const employmentStatuses = [
    'Unavailable for work',
    'Unemployed - actively looking for work',
    'Unemployed - not actively looking for work',
  ]

  describe(`Destination: ${destinations.employedBeforePrison}`, () => {
    employmentStatuses.forEach(employmentStatus => {
      it(`"${employmentStatus}" and "Yes, has been employed before" routes to "${destinations.employedBeforePrison}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What was Sam's employment status before custody?").getRadio(employmentStatus).clickLabel()

        cy.getQuestion("What was Sam's employment status before custody?")
          .getRadio(employmentStatus)
          .getConditionalQuestion()
          .getRadio('Yes, has been employed before')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.landingPage)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.employedBeforePrison)
        cy.assertBackLinkIs(destinations.landingPage)
        cy.assertResumeUrlIs(sectionName, destinations.employedBeforePrison)
      })
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.employedBeforePrison)

        cy.getQuestion("What was Sam's employment history before custody?")
          .getRadio('Continuous employment history')
          .clickLabel()

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

        cy.assertResumeUrlIs(sectionName, destinations.employedBeforePrison)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })

  describe(`Destination: ${destinations.neverEmployedPrison}`, () => {
    employmentStatuses.forEach(employmentStatus => {
      it(`"${employmentStatus}" and "No, has never been employed" routes to "${destinations.neverEmployedPrison}"`, () => {
        cy.visitStep(destinations.landingPage)

        cy.getQuestion("What was Sam's employment status before custody?").getRadio(employmentStatus).clickLabel()

        cy.getQuestion("What was Sam's employment status before custody?")
          .getRadio(employmentStatus)
          .getConditionalQuestion()
          .getRadio('No, has never been employed')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.landingPage)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.neverEmployedPrison)
        cy.assertBackLinkIs(destinations.landingPage)
        cy.assertResumeUrlIs(sectionName, destinations.neverEmployedPrison)
      })
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`routes to ${destinations.summary}`, () => {
        cy.visitStep(destinations.neverEmployedPrison)

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

        cy.assertResumeUrlIs(sectionName, destinations.neverEmployedPrison)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
      })

      testPractitionerAnalysis(sectionName, destinations.summary, destinations.analysis)
    })
  })
})
