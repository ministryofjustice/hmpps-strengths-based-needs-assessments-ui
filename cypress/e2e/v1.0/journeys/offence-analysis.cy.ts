describe('Origin: /offence-analysis', () => {
  const destinations = {
    landingPage: '/offence-analysis',
    victimCreate: '/offence-analysis-victim/create',
    victimUpdate: '/offence-analysis-victim/edit',
    victimDelete: '/offence-analysis-victim/delete',
    victimsSummary: '/offence-analysis-victims-summary',
    othersInvolved: '/offence-analysis-others-involved',
    details: '/offence-analysis-details',
    summary: '/offence-analysis-complete',
  }

  const sectionName = 'Offence analysis'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.othersInvolved}`, () => {
    it(`Victim is "Other" routes to "${destinations.othersInvolved}"`, () => {
      cy.visitStep(destinations.landingPage)

      cy.getQuestion('Enter a brief description of the current index offence(s)').enterText('Test')
      cy.getQuestion('Did the current index offence(s) have any of the following elements?')
        .getCheckbox('Arson')
        .clickLabel()
      cy.getQuestion('Why did the current index offence(s) happen?').enterText('Test')
      cy.getQuestion('Did the current index offence(s) involve any of the following motivations?')
        .getCheckbox('Thrill seeking')
        .clickLabel()
      cy.getQuestion('Who was the victim?').getCheckbox('Other').clickLabel()
      cy.getQuestion('Who was the victim?').getCheckbox('Other').getConditionalQuestion().enterText('Test')

      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.othersInvolved)
      cy.assertResumeUrlIs(sectionName, destinations.othersInvolved)
    })

    describe(`Destination: ${destinations.details}`, () => {
      it(`Routes to "${destinations.details}"`, () => {
        cy.visitStep(destinations.othersInvolved)

        cy.getQuestion('How many other people were involved with committing the current index offence(s)?')
          .getRadio('1')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.othersInvolved)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.details)
        cy.assertResumeUrlIs(sectionName, destinations.details)
      })

      describe(`Destination: ${destinations.summary}`, () => {
        it(`Routes to "${destinations.summary}"`, () => {
          cy.visitStep(destinations.details)

          cy.getQuestion('Was Sam the leader in regard to committing the current index offence(s)?')
            .getRadio('No')
            .clickLabel()
          cy.getQuestion(
            'Does Sam recognise the impact or consequences on the victims or others and the wider community?',
          )
            .getRadio('No')
            .clickLabel()
          cy.getQuestion('Does Sam accept responsibility for the current index offence(s)?').getRadio('No').clickLabel()
          cy.getQuestion('What are the patterns of offending?').enterText('¯\\_(ツ)_/¯')
          cy.getQuestion('Is the current offence(s) an escalation in seriousness from previous offending?')
            .getRadio('No')
            .clickLabel()
          cy.getQuestion(
            'Is the current offence(s) linked to risk of serious harm, risks to the individual or other risks?',
          )
            .getRadio('No')
            .clickLabel()
          cy.getQuestion(
            'Is the current offence(s) linked to risk of serious harm, risks to the individual or other risks?',
          )
            .getRadio('No')
            .getConditionalQuestion()
            .enterText('¯\\_(ツ)_/¯')
          cy.getQuestion('Is there evidence that Sam has ever been a perpetrator of domestic abuse?')
            .getRadio('No')
            .clickLabel()
          cy.getQuestion('Is there evidence that Sam has ever been a victim of domestic abuse?')
            .getRadio('No')
            .clickLabel()

          cy.assertResumeUrlIs(sectionName, destinations.details)
          cy.markAsComplete()
          cy.assertStepUrlIs(destinations.summary)
          cy.assertResumeUrlIs(sectionName, destinations.summary)
          cy.currentSectionMarkedAsComplete(sectionName)

          // checkmark is removed on making a change
          cy.getSummary(
            'How many other people were involved with committing the current index offence(s)?',
          ).clickChange()
          cy.assertStepUrlIs(destinations.othersInvolved)
          cy.getQuestion('How many other people were involved with committing the current index offence(s)?')
            .getRadio('2')
            .clickLabel()
          cy.saveAndContinue()

          cy.assertStepUrlIs(destinations.details)
          cy.currentSectionNotMarkedAsComplete(sectionName)
          cy.markAsComplete()

          cy.assertStepUrlIs(destinations.summary)
          cy.currentSectionMarkedAsComplete(sectionName)
        })
      })
    })
  })

  describe(`Destination: ${destinations.victimCreate}`, () => {
    it(`Victim is "One or more person" routes to "${destinations.victimCreate}"`, () => {
      cy.visitStep(destinations.landingPage)

      cy.getQuestion('Who was the victim?').getCheckbox('One or more person').clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.victimCreate)
      cy.assertResumeUrlIs(sectionName, destinations.victimsSummary)
    })

    describe(`Destination: ${destinations.victimsSummary}`, () => {
      it(`routes to ${destinations.victimsSummary}`, () => {
        cy.visitStep(destinations.victimCreate)

        cy.getQuestion("What is Sam's relationship to the victim?").getRadio('A stranger').clickLabel()
        cy.getQuestion("What is the victim's approximate age?").getRadio('0 to 4 years').clickLabel()
        cy.getQuestion("What is the victim's sex?").getRadio('Male').clickLabel()
        cy.getQuestion("What is the victim's race or ethnicity?").enterText('white{enter}')
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.victimsSummary)
        cy.assertResumeUrlIs(sectionName, destinations.victimsSummary)
      })

      describe(`Destination: ${destinations.othersInvolved}`, () => {
        it(`routes to ${destinations.othersInvolved}`, () => {
          cy.assertResumeUrlIs(sectionName, destinations.victimsSummary)

          cy.visitStep(destinations.victimsSummary)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.othersInvolved)
        })

        describe(`Destination: ${destinations.details}`, () => {
          it(`routes to ${destinations.details}`, () => {
            cy.assertResumeUrlIs(sectionName, destinations.details)

            cy.visitStep(destinations.othersInvolved)
            cy.saveAndContinue()
            cy.assertStepUrlIs(destinations.details)
          })

          describe(`Destination: ${destinations.summary}`, () => {
            it(`routes to ${destinations.summary}`, () => {
              cy.assertResumeUrlIs(sectionName, destinations.details)

              cy.visitStep(destinations.details)
              cy.markAsComplete()
              cy.assertStepUrlIs(destinations.summary)
              cy.assertResumeUrlIs(sectionName, destinations.summary)
            })
          })
        })
      })
    })
  })
})