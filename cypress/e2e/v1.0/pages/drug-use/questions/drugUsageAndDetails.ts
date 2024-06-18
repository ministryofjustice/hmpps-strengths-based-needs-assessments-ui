export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = 'Which drugs has Sam used?'
  const detailsStep = '/drug-usage-details'

  describe(question, () => {
    const drugs = [
      { name: 'Amphetamines', isInjected: true, hasTreatment: false },
      { name: 'Benzodiazepines', isInjected: true, hasTreatment: false },
      { name: 'Cannabis', isInjected: false, hasTreatment: false },
      { name: 'Cocaine hydrochloride', isInjected: true, hasTreatment: false },
      { name: 'Crack cocaine', isInjected: true, hasTreatment: false },
      { name: 'Ecstasy (also known as MDMA)', isInjected: false, hasTreatment: false },
      { name: 'Hallucinogenics', isInjected: false, hasTreatment: false },
      { name: 'Heroin', isInjected: true, hasTreatment: true },
      { name: 'Methadone (not prescribed)', isInjected: true, hasTreatment: false },
      { name: 'Misused prescribed drugs', isInjected: true, hasTreatment: false },
      { name: 'Other opiates', isInjected: true, hasTreatment: false },
      { name: 'Solvents (including gases and glues)', isInjected: false, hasTreatment: false },
      { name: 'Steroids', isInjected: true, hasTreatment: false },
      { name: 'Spice', isInjected: false, hasTreatment: false },
      { name: 'Other', isInjected: true, hasTreatment: false },
    ]

    const otherDrug = 'Cake'
    const drugName = (drug: string) => (drug === 'Other' ? otherDrug : drug)

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('Include current and previous drugs. Select all that apply.')
        .hasCheckboxes(drugs.map(({ name }) => name))

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select which drugs they have used')

      cy.checkAccessibility()
    })

    drugs.forEach(({ name: drug, isInjected, hasTreatment }) => {
      describe(`${drug} usage details`, () => {
        beforeEach(() => {
          cy.visitStep(stepUrl)
          cy.getQuestion(question).getCheckbox(drug).hasHint(null).clickLabel()
          if (drug === 'Other') {
            cy.getQuestion(question)
              .getCheckbox(drug)
              .getConditionalQuestion()
              .hasTitle('Enter drug name')
              .hasHint(null)
              .hasLimit(400)
            cy.saveAndContinue()
            cy.assertStepUrlIs(stepUrl)
            cy.getQuestion(question)
              .getCheckbox(drug)
              .getConditionalQuestion()
              .hasValidationError('Enter drug name')
              .enterText(otherDrug)
          } else {
            cy.getQuestion(question).getCheckbox(drug).hasConditionalQuestion(false)
          }
          cy.saveAndContinue()
          cy.assertStepUrlIs(detailsStep)

          cy.visitStep(summaryPage)
          cy.getDrugSummary(drugName(drug))
          cy.getSummary(question).clickChange()
          cy.assertQuestionUrl(question)

          if (drug === 'Other') {
            cy.getQuestion(question).getCheckbox(drug).isChecked().getConditionalQuestion().hasText(otherDrug)
          } else {
            cy.getQuestion(question).getCheckbox(drug).isChecked().hasConditionalQuestion(false)
          }

          cy.visitStep(detailsStep)
          cy.assertQuestionCount(0)
          cy.hasDrugQuestionGroups(1)
          cy.hasQuestionsForDrug(drugName(drug), 2)
        })

        const frequencyQuestion = 'How often is Sam using this drug?'

        describe(`${drug} - ${frequencyQuestion}`, () => {
          const frequencies = ['Daily', 'Weekly', 'Monthly', 'Occasionally', null, 'Not currently using this drug']

          it(`displays and validates the question`, () => {
            cy.getDrugQuestion(drugName(drug), frequencyQuestion).hasHint(null).hasRadios(frequencies)
            cy.saveAndContinue()
            cy.assertStepUrlIs(detailsStep)
            cy.getDrugQuestion(drugName(drug), frequencyQuestion).hasValidationError(
              'Select how often they are using this drug',
            )
            cy.checkAccessibility()
          })

          frequencies
            .filter(it => it !== null && it !== 'Not currently using this drug')
            .forEach(frequency => {
              it(`conditional field(s) are displayed for "${frequency}"`, () => {
                cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                  .getRadio(frequency)
                  .hasConditionalQuestion(false)
                  .clickLabel()

                if (isInjected) {
                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(0)
                    .hasTitle('Is Sam injecting this drug?')
                    .hasHint(null)
                    .hasRadios(['Yes', 'No'])
                }

                if (hasTreatment) {
                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(1)
                    .hasTitle('Is Sam receiving treatment?')
                    .hasHint(null)
                    .hasRadios(['Yes', 'No'])
                }

                cy.saveAndContinue()
                cy.assertStepUrlIs(detailsStep)

                if (isInjected) {
                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(0)
                    .hasTitle('Is Sam injecting this drug?')
                    .hasValidationError('Select if they are injecting this drug')
                }

                if (hasTreatment) {
                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(1)
                    .hasTitle('Is Sam receiving treatment?')
                    .hasValidationError('Select if they are receiving treatment')
                }

                if (isInjected) {
                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(0)
                    .getRadio('Yes')
                    .clickLabel()

                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(0)
                    .getRadio('Yes')
                    .hasConditionalQuestion(false)
                }

                if (hasTreatment) {
                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(1)
                    .getRadio('Yes')
                    .clickLabel()

                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(1)
                    .getRadio('Yes')
                    .hasConditionalQuestion(false)
                }

                cy.saveAndContinue()

                cy.visitStep(summaryPage)
                cy.checkAccessibility()

                if (hasTreatment) cy.getDrugSummary(drugName(drug)).hasReceivingTreatmentCurrently('Yes')
                if (isInjected) cy.getDrugSummary(drugName(drug)).hasInjectedCurrently('Yes')
                cy.getDrugSummary(drugName(drug)).hasFrequency(frequency).changeDrugUsage()
                cy.assertDrugQuestionGroupUrl(drug)

                if (isInjected) {
                  cy.getQuestion(frequencyQuestion)
                    .getRadio(frequency)
                    .isChecked()
                    .getNthConditionalQuestion(0)
                    .getRadio('Yes')
                    .isChecked()
                }

                if (hasTreatment) {
                  cy.getQuestion(frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(1)
                    .getRadio('Yes')
                    .isChecked()
                }

                if (!isInjected && !hasTreatment) {
                  cy.getQuestion(frequencyQuestion).getRadio(frequency).isChecked().hasConditionalQuestion(false)
                }

                cy.visitStep(detailsStep)

                if (isInjected) {
                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(0)
                    .hasTitle('Is Sam injecting this drug?')
                    .getRadio('No')
                    .clickLabel()

                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(0)
                    .getRadio('No')
                    .hasConditionalQuestion(false)
                }

                if (hasTreatment) {
                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(1)
                    .hasTitle('Is Sam receiving treatment?')
                    .getRadio('No')
                    .clickLabel()

                  cy.getDrugQuestion(drugName(drug), frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(1)
                    .getRadio('No')
                    .hasConditionalQuestion(false)
                }

                cy.saveAndContinue()

                cy.visitStep(summaryPage)
                cy.checkAccessibility()

                if (hasTreatment) cy.getDrugSummary(drugName(drug)).hasReceivingTreatmentCurrently('No')
                if (isInjected) cy.getDrugSummary(drugName(drug)).hasInjectedCurrently('No')
                cy.getDrugSummary(drugName(drug)).hasFrequency(frequency).changeDrugUsage()
                cy.assertDrugQuestionGroupUrl(drug)

                if (isInjected) {
                  cy.getQuestion(frequencyQuestion)
                    .getRadio(frequency)
                    .isChecked()
                    .getNthConditionalQuestion(0)
                    .getRadio('No')
                    .isChecked()
                }

                if (hasTreatment) {
                  cy.getQuestion(frequencyQuestion)
                    .getRadio(frequency)
                    .getNthConditionalQuestion(1)
                    .getRadio('No')
                    .isChecked()
                }

                if (!isInjected && !hasTreatment) {
                  cy.getQuestion(frequencyQuestion).getRadio(frequency).isChecked().hasConditionalQuestion(false)
                }
              })
            })

          it(`no conditional fields are displayed for "Not currently using this drug"`, () => {
            const frequency = 'Not currently using this drug'
            cy.getDrugQuestion(drugName(drug), frequencyQuestion)
              .getRadio(frequency)
              .hasConditionalQuestion(false)
              .clickLabel()

            cy.getDrugQuestion(drugName(drug), frequencyQuestion).getRadio(frequency).hasConditionalQuestion(false)

            cy.saveAndContinue()

            cy.visitStep(summaryPage)
            cy.checkAccessibility()

            cy.getDrugSummary(drugName(drug)).hasFrequency(frequency).changeDrugUsage()
            cy.assertDrugQuestionGroupUrl(drug)

            cy.getQuestion(frequencyQuestion).getRadio(frequency).isChecked().hasConditionalQuestion(false)
          })
        })

        const pastUseQuestion = 'Has Sam used this drug in the past?'

        describe(`${drug} - ${pastUseQuestion}`, () => {
          it(`displays and validates the question`, () => {
            cy.getDrugQuestion(drugName(drug), pastUseQuestion).hasHint(null).hasRadios(['Yes', 'No'])
            cy.saveAndContinue()
            cy.assertStepUrlIs(detailsStep)
            cy.getDrugQuestion(drugName(drug), pastUseQuestion).hasValidationError(
              'Select if they have used this drug in the past',
            )
            cy.checkAccessibility()
          })

          it(`conditional field(s) are displayed for "Yes"`, () => {
            cy.getDrugQuestion(drugName(drug), pastUseQuestion)
              .getRadio('Yes')
              .hasConditionalQuestion(false)
              .clickLabel()

            if (isInjected) {
              cy.getDrugQuestion(drugName(drug), pastUseQuestion)
                .getRadio('Yes')
                .getNthConditionalQuestion(0)
                .hasTitle('Was Sam injecting this drug?')
                .hasHint(null)
                .hasRadios(['Yes', 'No'])
            }

            if (hasTreatment) {
              cy.getDrugQuestion(drugName(drug), pastUseQuestion)
                .getRadio('Yes')
                .getNthConditionalQuestion(1)
                .hasTitle('Is Sam receiving treatment?')
                .hasHint(null)
                .hasRadios(['Yes', 'No'])
            }

            cy.saveAndContinue()
            cy.assertStepUrlIs(detailsStep)

            if (isInjected) {
              cy.getDrugQuestion(drugName(drug), pastUseQuestion)
                .getRadio('Yes')
                .getNthConditionalQuestion(0)
                .hasTitle('Was Sam injecting this drug?')
                .hasValidationError('Select if they were injecting this drug')
                .getRadio('Yes')
                .clickLabel()

              cy.getDrugQuestion(drugName(drug), pastUseQuestion)
                .getRadio('Yes')
                .getNthConditionalQuestion(0)
                .getRadio('Yes')
                .hasConditionalQuestion(false)
            }

            if (hasTreatment) {
              cy.getDrugQuestion(drugName(drug), pastUseQuestion)
                .getRadio('Yes')
                .getNthConditionalQuestion(1)
                .hasTitle('Is Sam receiving treatment?')
                .hasValidationError('Select if they are receiving treatment')
                .getRadio('Yes')
                .clickLabel()

              cy.getDrugQuestion(drugName(drug), pastUseQuestion)
                .getRadio('Yes')
                .getNthConditionalQuestion(1)
                .getRadio('Yes')
                .hasConditionalQuestion(false)
            }

            cy.checkAccessibility()
            cy.saveAndContinue()

            cy.visitStep(summaryPage)
            cy.checkAccessibility()

            if (hasTreatment) cy.getDrugSummary(drugName(drug)).hasReceivingTreatmentPreviously('Yes')
            if (isInjected) cy.getDrugSummary(drugName(drug)).hasInjectedPreviously('Yes')
            cy.getDrugSummary(drugName(drug)).hasPreviousUse('Yes').changeDrugUsage()
            cy.assertDrugQuestionGroupUrl(drug)

            if (isInjected) {
              cy.getQuestion(pastUseQuestion)
                .getRadio('Yes')
                .isChecked()
                .getNthConditionalQuestion(0)
                .getRadio('Yes')
                .isChecked()
            }

            if (hasTreatment) {
              cy.getQuestion(pastUseQuestion).getRadio('Yes').getNthConditionalQuestion(1).getRadio('Yes').isChecked()
            }

            if (!isInjected && !hasTreatment) {
              cy.getQuestion(pastUseQuestion).getRadio('Yes').isChecked().hasConditionalQuestion(false)
            }

            cy.visitStep(detailsStep)

            if (isInjected) {
              cy.getDrugQuestion(drugName(drug), pastUseQuestion)
                .getRadio('Yes')
                .getNthConditionalQuestion(0)
                .hasTitle('Was Sam injecting this drug?')
                .getRadio('No')
                .clickLabel()

              cy.getDrugQuestion(drugName(drug), pastUseQuestion)
                .getRadio('Yes')
                .getNthConditionalQuestion(0)
                .getRadio('No')
                .hasConditionalQuestion(false)
            }

            if (hasTreatment) {
              cy.getDrugQuestion(drugName(drug), pastUseQuestion)
                .getRadio('Yes')
                .getNthConditionalQuestion(1)
                .hasTitle('Is Sam receiving treatment?')
                .getRadio('No')
                .clickLabel()

              cy.getDrugQuestion(drugName(drug), pastUseQuestion)
                .getRadio('Yes')
                .getNthConditionalQuestion(1)
                .getRadio('No')
                .hasConditionalQuestion(false)
            }

            cy.saveAndContinue()

            cy.visitStep(summaryPage)
            cy.checkAccessibility()

            if (hasTreatment) cy.getDrugSummary(drugName(drug)).hasReceivingTreatmentPreviously('No')
            if (isInjected) cy.getDrugSummary(drugName(drug)).hasInjectedPreviously('No')
            cy.getDrugSummary(drugName(drug)).hasPreviousUse('Yes').changeDrugUsage()
            cy.assertDrugQuestionGroupUrl(drug)

            if (isInjected) {
              cy.getQuestion(pastUseQuestion)
                .getRadio('Yes')
                .isChecked()
                .getNthConditionalQuestion(0)
                .getRadio('No')
                .isChecked()
            }

            if (hasTreatment) {
              cy.getQuestion(pastUseQuestion).getRadio('Yes').getNthConditionalQuestion(1).getRadio('No').isChecked()
            }

            if (!isInjected && !hasTreatment) {
              cy.getQuestion(pastUseQuestion).getRadio('Yes').isChecked().hasConditionalQuestion(false)
            }
          })

          it(`no conditional fields are displayed for "No"`, () => {
            cy.getDrugQuestion(drugName(drug), pastUseQuestion)
              .getRadio('No')
              .hasConditionalQuestion(false)
              .clickLabel()

            cy.getDrugQuestion(drugName(drug), pastUseQuestion).getRadio('No').hasConditionalQuestion(false)

            cy.saveAndContinue()

            cy.visitStep(summaryPage)
            cy.checkAccessibility()

            cy.getDrugSummary(drugName(drug)).hasPreviousUse('No').changeDrugUsage()
            cy.assertDrugQuestionGroupUrl(drug)

            cy.getQuestion(pastUseQuestion).getRadio('No').isChecked().hasConditionalQuestion(false)
          })
        })
      })
    })
  })
}
