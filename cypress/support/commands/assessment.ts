// commands related to the overall assessment

export const saveAndContinue = () => {
  return cy.get(`form button:contains('Save and continue')`).should('have.length', 1).click()
}

export const markAsComplete = () => {
  return cy.get(`form button:contains('Mark as complete')`).should('have.length', 1).click()
}
