// commands related to radio and checkbox options

export const isChecked = (subject: JQuery) => {
  cy.wrap(subject).children('input').should('be.checked')
  return cy.wrap(subject)
}

export const isNotChecked = (subject: JQuery) => {
  cy.wrap(subject).children('input').should('not.be.checked')
  return cy.wrap(subject)
}

export const isOptionNumber = (subject: JQuery, position: number) => {
  const el = subject
    .parent()
    .find('> .govuk-radios__item:visible, > .govuk-checkboxes__item:visible')
    .eq(position - 1)

  expect(el[0], `the option at position ${position} is not the expected option`).to.eql(subject[0])
  return cy.wrap(subject)
}

export const selectOption = (subject: JQuery) => {
  cy.wrap(subject).children('label').first().click()
  return cy.wrap(subject)
}

export const hasConditionalQuestion = (subject: JQuery, expect: boolean = true) => {
  cy.wrap(subject)
    .next('.govuk-radios__conditional:visible, .govuk-checkboxes__conditional:visible')
    .should(expect ? 'exist' : 'not.exist')
  return cy.wrap(subject)
}

export const getConditionalQuestion = (subject: JQuery) => {
  return cy
    .wrap(subject)
    .next('.govuk-radios__conditional:visible, .govuk-checkboxes__conditional:visible')
    .find('> .form-group > fieldset')
    .should('be.visible')
    .and('have.length', 1)
}