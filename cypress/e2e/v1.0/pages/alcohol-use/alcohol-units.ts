// export default (stepUrl: string, summaryPage: string, positionNumber: number) => {
//   const question = 'How many units of alcohol does Sam have on a typical day of drinking?'
//   const options = ['1 to 2 units', '3 to 4 units', '5 to 6 units', '7 to 9 units', '10 or more units']

//   describe(question, () => {
//     it(`displays and validates the question`, () => {
//       cy.getQuestion(question).isQuestionNumber(positionNumber).hasHint('Help with alcohol units').hasRadios(options)
//       cy.saveAndContinue()
//       cy.assertStepUrlIs(stepUrl)
//       cy.getQuestion(question).hasValidationError('Select how many units of alcohol they have on a typical day of drinking')
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
