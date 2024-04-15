// commands related to the overall assessment

export const saveAndContinue = () => {
  return cy.get(`form button`).should('contain.text', 'Save and continue').click()
}

export const markAsComplete = () => {
  return cy.get(`form button`).should('contain.text', 'Mark as complete').click()
}
