// export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
//   const question = 'Has Sam ever drank alcohol?'
//   const options = ['Yes, including the last 3 months', 'Yes, but not in the last 3 months', 'No']

//   describe(question, () => {
//     it(`displays and validates the question`, () => {
//       cy.getQuestion(question).isQuestionNumber(positionNumber).hasRadios(options)
//       cy.saveAndContinue()
//       cy.assertStepUrlIs(stepUrl)
//       cy.getQuestion(question).hasValidationError('Select if they have ever drank alcohol')
//       cy.checkAccessibility()
//     })

//     options.forEach(option => {
//       it(`summary page displays "${option}"`, () => {
//         cy.visitStep(stepUrl)
//         cy.getQuestion(question).getRadio(option).clickLabel()

//         cy.saveAndContinue()

//         cy.visitStep(summaryPage)
//         cy.getSummary(question).getAnswer(option).hasNoSecondaryAnswer()
//         cy.getSummary(question).clickChange()
//         cy.assertStepUrlIs(stepUrl)
//         cy.assertQuestionUrl(question)
//       })
//     })
//   })
// }
