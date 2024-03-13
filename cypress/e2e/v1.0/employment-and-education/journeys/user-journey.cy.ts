describe('Origin: /employment-education', () => {
  const destinations = {
    employed: '/employed',
    retired: '/retired',
    hasBeenEmployed: '/has-been-employed',
    neverBeenEmployed: '/never-been-employed',
    analysis: '/employment-education-analysis',
  }

  beforeEach(() => {
    cy.createAssessment()
    cy.visitSection('Employment and education')
  })

  describe(`Destination: ${destinations.employed}`, () => {
    ;['Full-time', 'Part-time', 'Temporary or casual', 'Apprenticeship'].forEach(typeOfEmployment => {
      it(`"Employed" and "${typeOfEmployment}" routes to "${destinations.employed}"`, () => {
        cy.getQuestion("What is Paul's current employment status?").getRadio('Employed').selectOption()

        cy.getQuestion("What is Paul's current employment status?")
          .getRadio('Employed')
          .getConditionalQuestion()
          .getRadio(typeOfEmployment)
          .selectOption()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.employed)
      })
    })

    it(`"Self-employed" routes to "${destinations.employed}"`, () => {
      cy.getQuestion("What is Paul's current employment status?").getRadio('Self-employed').selectOption()

      cy.saveAndContinue()

      cy.assertStepUrlIs(destinations.employed)
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.employed)

        cy.getQuestion("What is Paul's employment history?").getRadio('Continuous employment history').selectOption()

        cy.getQuestion('Does Paul have any other responsibilities?').getCheckbox('None').selectOption()

        cy.getQuestion('Select the highest level of education Paul has completed')
          .getRadio('Entry level')
          .selectOption()

        cy.getQuestion('Does Paul have any professional or vocational qualifications?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul have skills that could help them in a job or at work?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul have difficulties with reading, writing or numeracy?')
          .getCheckbox('No difficulties')
          .selectOption()

        cy.getQuestion("What is Paul's overall experience of employment?").getRadio('Positive').selectOption()

        cy.getQuestion("What is Paul's experience of education?").getRadio('Positive').selectOption()

        cy.getQuestion('Does Paul want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .selectOption()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })
    })
  })

  describe(`Destination: ${destinations.retired}`, () => {
    it(`"Retired" routes to "${destinations.retired}"`, () => {
      cy.getQuestion("What is Paul's current employment status?").getRadio('Retired').selectOption()

      cy.saveAndContinue()

      cy.assertStepUrlIs(destinations.retired)
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.retired)

        cy.getQuestion("What is Paul's employment history?").getRadio('Continuous employment history').selectOption()

        cy.getQuestion('Does Paul have any other responsibilities?').getCheckbox('None').selectOption()

        cy.getQuestion('Select the highest level of education Paul has completed')
          .getRadio('Entry level')
          .selectOption()

        cy.getQuestion('Does Paul have any professional or vocational qualifications?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul have skills that could help them in a job or at work?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul have difficulties with reading, writing or numeracy?')
          .getCheckbox('No difficulties')
          .selectOption()

        cy.getQuestion('Does Paul want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .selectOption()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })
    })
  })

  const employmentStatuses = [
    'Currently unavailable for work',
    'Unemployed - actively looking for work',
    'Unemployed - not actively looking for work',
  ]

  describe(`Destination: ${destinations.hasBeenEmployed}`, () => {
    employmentStatuses.forEach(employmentStatus => {
      it(`"${employmentStatus}" and "Yes, has been employed before" routes to "${destinations.hasBeenEmployed}"`, () => {
        cy.getQuestion("What is Paul's current employment status?").getRadio(employmentStatus).selectOption()

        cy.getQuestion("What is Paul's current employment status?")
          .getRadio(employmentStatus)
          .getConditionalQuestion()
          .getRadio('Yes, has been employed before')
          .selectOption()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.hasBeenEmployed)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.hasBeenEmployed)

        cy.getQuestion("What is Paul's employment history?").getRadio('Continuous employment history').selectOption()

        cy.getQuestion('Does Paul have any other responsibilities?').getCheckbox('None').selectOption()

        cy.getQuestion('Select the highest level of education Paul has completed')
          .getRadio('Entry level')
          .selectOption()

        cy.getQuestion('Does Paul have any professional or vocational qualifications?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul have skills that could help them in a job or at work?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul have difficulties with reading, writing or numeracy?')
          .getCheckbox('No difficulties')
          .selectOption()

        cy.getQuestion("What is Paul's overall experience of employment?").getRadio('Positive').selectOption()

        cy.getQuestion("What is Paul's experience of education?").getRadio('Positive').selectOption()

        cy.getQuestion('Does Paul want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .selectOption()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })
    })
  })

  describe(`Destination: ${destinations.neverBeenEmployed}`, () => {
    employmentStatuses.forEach(employmentStatus => {
      it(`"${employmentStatus}" and "No, has never been employed" routes to "${destinations.neverBeenEmployed}"`, () => {
        cy.getQuestion("What is Paul's current employment status?").getRadio(employmentStatus).selectOption()

        cy.getQuestion("What is Paul's current employment status?")
          .getRadio(employmentStatus)
          .getConditionalQuestion()
          .getRadio('No, has never been employed')
          .selectOption()

        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.neverBeenEmployed)
      })
    })

    describe(`Destination: ${destinations.analysis}`, () => {
      it(`routes to ${destinations.analysis}`, () => {
        cy.visitStep(destinations.neverBeenEmployed)

        cy.getQuestion('Does Paul have any other responsibilities?').getCheckbox('None').selectOption()

        cy.getQuestion('Select the highest level of education Paul has completed')
          .getRadio('Entry level')
          .selectOption()

        cy.getQuestion('Does Paul have any professional or vocational qualifications?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul have skills that could help them in a job or at work?').getRadio('No').selectOption()

        cy.getQuestion('Does Paul have difficulties with reading, writing or numeracy?')
          .getCheckbox('No difficulties')
          .selectOption()

        cy.getQuestion("What is Paul's experience of education?").getRadio('Positive').selectOption()

        cy.getQuestion('Does Paul want to make changes to their employment and education?')
          .getRadio('Not applicable')
          .selectOption()

        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.analysis)
      })
    })
  })
})
