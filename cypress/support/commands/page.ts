// command related to the overall page/step

// eslint-disable-next-line import/prefer-default-export
export const assertQuestionCount = (count: number) => {
  cy.get('form > .form-group:visible').should('have.length', count)
}
