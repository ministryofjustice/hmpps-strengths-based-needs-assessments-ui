import config from '../../../../../support/config'

export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
  const question = "What is Sam's history of intimate relationships?"

  describe(question, () => {
    const options = [
      [
        'History of stable, supportive, positive and rewarding relationships',
        'This includes if they do not have a history of relationships but appear capable of starting and maintaining one.',
      ],
      ['History of both positive and negative relationships', null],
      [
        'History of unstable, unsupportive and destructive relationships',
        'This includes if they are single and have never had a relationship but would like one.',
      ],
    ]

    it('displays and validates the question', () => {
      cy.getQuestion(question)
        .isQuestionNumber(positionNumber)
        .hasHint('An intimate relationship is one that involves physical and/or emotional closeness.')
        .hasRadios(options.map(([option, _]) => option))

      cy.saveAndContinue()

      cy.assertStepUrlIs(stepUrl)
      cy.getQuestion(question).hasValidationError('Select their history of intimate relationships')

      cy.checkAccessibility()
    })

    options.forEach(([option, hint]) => {
      it(`optional details field is displayed for "${option}"`, () => {
        cy.getQuestion(question).getRadio(option).hasHint(hint).hasConditionalQuestion(false).clickLabel()

        cy.getQuestion(question)
          .getRadio(option)
          .getConditionalQuestion()
          .hasTitle('Give details (optional)')
          .hasHint('Consider patterns and quality of any significant relationships.')
          .hasLimit(config.characterLimit.default)

        cy.saveAndContinue()

        cy.getQuestion(question).getRadio(option).getConditionalQuestion().hasNoValidationError().enterText('some text')

        cy.checkAccessibility()

        cy.saveAndContinue()
        cy.visitStep(summaryPage)
        cy.getSummary(question).getAnswer(option).hasSecondaryAnswer('some text')
        cy.checkAccessibility()
        cy.getSummary(question).clickChange()
        cy.assertStepUrlIs(stepUrl)
        cy.assertQuestionUrl(question)
        cy.getQuestion(question).getRadio(option).isChecked().getConditionalQuestion().hasText('some text')
      })
    })
  })
}
