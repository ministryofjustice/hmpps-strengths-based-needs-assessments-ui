describe('Origin: /offence-analysis', () => {
  const destinations = {
    landingPage: '/offence-analysis',
    victimCreate: '/offence-analysis-victim/create',
    victimUpdate: '/offence-analysis-victim/edit',
    victimDelete: '/offence-analysis-victim/delete',
    victimsSummary: '/offence-analysis-victim-details',
    involvedParties: '/offence-analysis-involved-parties',
    impact: '/offence-analysis-impact',
    impactOthersInvolved: '/offence-analysis-impact-others-involved',
    summary: '/offence-analysis-summary',
  }

  const sectionName = 'Offence analysis'

  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  describe(`Destination: ${destinations.involvedParties}`, () => {
    it(`Victim is "Other" routes to "${destinations.involvedParties}"`, () => {
      cy.visitStep(destinations.landingPage)

      cy.getQuestion('Enter a brief description of the current index offence(s)').enterText('Test')
      cy.getQuestion('Did the current index offence(s) have any of the following elements?')
        .getCheckbox('Arson')
        .clickLabel()
      cy.getQuestion('Why did the current index offence(s) happen?').enterText('Test')
      cy.getQuestion('Did the current index offence(s) involve any of the following motivations?')
        .getCheckbox('Thrill seeking')
        .clickLabel()
      cy.getQuestion('Who was the offence committed against?').getCheckbox('Other').clickLabel()
      cy.getQuestion('Who was the offence committed against?')
        .getCheckbox('Other')
        .getConditionalQuestion()
        .enterText('Test')

      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.involvedParties)
      cy.assertResumeUrlIs(sectionName, destinations.involvedParties)
    })

    describe(`Destination: ${destinations.impact}`, () => {
      it(`Routes to "${destinations.impact}"`, () => {
        cy.visitStep(destinations.involvedParties)

        cy.getQuestion('How many other people were involved with committing the current index offence(s)?')
          .getRadio('None')
          .clickLabel()

        cy.assertResumeUrlIs(sectionName, destinations.involvedParties)
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.impact)
        cy.assertResumeUrlIs(sectionName, destinations.impact)
      })

      describe(`Destination: ${destinations.summary}`, () => {
        it(`Routes to "${destinations.summary}"`, () => {
          cy.visitStep(destinations.impact)

          cy.getQuestion(
            'Does Sam recognise the impact or consequences on the victims or others and the wider community?',
          )
            .getRadio('No')
            .clickLabel()
          cy.getQuestion('Does Sam accept responsibility for the current index offence(s)?').getRadio('No').clickLabel()
          cy.getQuestion('What are the patterns of offending?').enterText('¯\\_(ツ)_/¯')
          cy.getQuestion('Is the current index offence(s) an escalation in seriousness from previous offending?')
            .getRadio('No')
            .clickLabel()
          cy.getQuestion(
            'Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?',
          )
            .getRadio('No')
            .clickLabel()
          cy.getQuestion(
            'Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?',
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

          cy.assertResumeUrlIs(sectionName, destinations.impact)
          cy.markAsComplete()
          cy.assertStepUrlIs(destinations.summary)
          cy.assertResumeUrlIs(sectionName, destinations.summary)
          cy.currentSectionMarkedAsComplete(sectionName)

          // checkmark is removed on making a change
          cy.getSummary(
            'How many other people were involved with committing the current index offence(s)?',
          ).clickChange()
          cy.assertStepUrlIs(destinations.involvedParties)
          cy.getQuestion('How many other people were involved with committing the current index offence(s)?')
            .getRadio('2')
            .clickLabel()
          cy.saveAndContinue()

          cy.assertStepUrlIs(destinations.impactOthersInvolved)
          cy.currentSectionNotMarkedAsComplete(sectionName)
          cy.getQuestion('Was Sam the leader in regard to committing the current index offence(s)?')
            .getRadio('No')
            .clickLabel()
          cy.markAsComplete()

          cy.assertStepUrlIs(destinations.summary)
          cy.currentSectionMarkedAsComplete(sectionName)
        })
      })
    })
  })

  describe(`Destination: ${destinations.impactOthersInvolved}`, () => {
    it(`Routes to "${destinations.impactOthersInvolved}"`, () => {
      cy.visitStep(destinations.involvedParties)

      cy.getQuestion('How many other people were involved with committing the current index offence(s)?')
        .getRadio('1')
        .clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.involvedParties)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.impactOthersInvolved)
      cy.assertResumeUrlIs(sectionName, destinations.impactOthersInvolved)
    })

    describe(`Destination: ${destinations.summary}`, () => {
      it(`Routes to "${destinations.summary}"`, () => {
        cy.visitStep(destinations.impactOthersInvolved)

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
        cy.getQuestion('Is the current index offence(s) an escalation in seriousness from previous offending?')
          .getRadio('No')
          .clickLabel()
        cy.getQuestion(
          'Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?',
        )
          .getRadio('No')
          .clickLabel()
        cy.getQuestion(
          'Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?',
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

        cy.assertResumeUrlIs(sectionName, destinations.impactOthersInvolved)
        cy.markAsComplete()
        cy.assertStepUrlIs(destinations.summary)
        cy.assertResumeUrlIs(sectionName, destinations.summary)
        cy.currentSectionMarkedAsComplete(sectionName)

        // checkmark is removed on making a change
        cy.getSummary('How many other people were involved with committing the current index offence(s)?').clickChange()
        cy.assertStepUrlIs(destinations.involvedParties)
        cy.getQuestion('How many other people were involved with committing the current index offence(s)?')
          .getRadio('2')
          .clickLabel()
        cy.saveAndContinue()

        cy.assertStepUrlIs(destinations.impactOthersInvolved)
        cy.currentSectionNotMarkedAsComplete(sectionName)
        cy.markAsComplete()

        cy.assertStepUrlIs(destinations.summary)
        cy.currentSectionMarkedAsComplete(sectionName)
      })
    })
  })

  describe(`Destination: ${destinations.victimCreate}`, () => {
    it(`Victim is "One or more people" routes to "${destinations.victimCreate}"`, () => {
      cy.visitStep(destinations.landingPage)

      cy.getQuestion('Who was the offence committed against?').getCheckbox('One or more people').clickLabel()

      cy.assertResumeUrlIs(sectionName, destinations.landingPage)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.victimCreate)
      cy.assertResumeUrlIs(sectionName, destinations.victimsSummary)
    })

    describe(`Destination: ${destinations.victimsSummary}`, () => {
      it(`routes to ${destinations.victimsSummary}`, () => {
        cy.visitStep(destinations.victimCreate)

        cy.getQuestion('Who is the victim?').getRadio('A stranger').clickLabel()
        cy.getQuestion("What is the victim's approximate age?").getRadio('0 to 4 years').clickLabel()
        cy.getQuestion("What is the victim's sex?").getRadio('Male').clickLabel()
        cy.getQuestion("What is the victim's race or ethnicity?").enterText('white{enter}')
        cy.saveAndContinue()
        cy.assertStepUrlIs(destinations.victimsSummary)
        cy.assertResumeUrlIs(sectionName, destinations.victimsSummary)
      })

      describe(`Destination: ${destinations.involvedParties}`, () => {
        it(`routes to ${destinations.involvedParties}`, () => {
          cy.assertResumeUrlIs(sectionName, destinations.victimsSummary)

          cy.visitStep(destinations.victimsSummary)
          cy.saveAndContinue()
          cy.assertStepUrlIs(destinations.involvedParties)
        })

        describe(`Destination: ${destinations.impactOthersInvolved}`, () => {
          it(`routes to ${destinations.impactOthersInvolved}`, () => {
            cy.assertResumeUrlIs(sectionName, destinations.impactOthersInvolved)

            cy.visitStep(destinations.involvedParties)
            cy.saveAndContinue()
            cy.assertStepUrlIs(destinations.impactOthersInvolved)
          })

          describe(`Destination: ${destinations.summary}`, () => {
            it(`routes to ${destinations.summary}`, () => {
              cy.assertResumeUrlIs(sectionName, destinations.impactOthersInvolved)

              cy.visitStep(destinations.impactOthersInvolved)
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
