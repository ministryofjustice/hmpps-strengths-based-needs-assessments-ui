// commands that can be chained onto a question

export const getQuestion = (title: string) => {
  return cy
    .get(`form > .form-group > fieldset > legend`)
    .contains(title)
    .should('be.visible')
    .and('have.length', 1)
    .parent()
}

export const hasTitle = (subject: JQuery, title: string) => {
  cy.wrap(subject).children('legend').first().should('be.visible').and('have.length', 1).and('contain.text', title)
  return cy.wrap(subject)
}

export const isQuestionNumber = (subject: JQuery, position: number) => {
  const el = subject
    .parent()
    .parent()
    .find('> .form-group')
    .eq(position - 1)
    .children('fieldset')
  expect(el, 'this should match to a single element').to.have.lengthOf(1)
  expect(el[0], `the question at position ${position} is not the expected question`).to.eql(subject[0])
  return cy.wrap(subject)
}

export const hasHint = (subject: JQuery, hint: string) => {
  if (hint) {
    cy.wrap(subject).children('.govuk-hint').should('contain.text', hint)
  } else {
    cy.wrap(subject).children('.govuk-hint').should('not.exist')
  }
  return cy.wrap(subject)
}

export const hasValidationError = (subject: JQuery, message: string) => {
  cy.wrap(subject)
    .children('.govuk-error-message')
    .should('have.length', 1)
    .first()
    .should('be.visible')
    .and('contain.text', message)
    .invoke('attr', 'id')
    .then((id: string) => {
      cy.get(`.govuk-error-summary a[href="#${id}"]`)
        .should('be.visible')
        .and('have.length', 1)
        .and('contain.text', message)
        .click()
      cy.url().then(url => expect(url.endsWith(`#${id}`), `${url} should end with ${id}`).to.be.true)
    })
  return cy.wrap(subject)
}

export const getRadio = (subject: JQuery, label: string) => {
  return cy
    .wrap(subject)
    .find('> .govuk-radios > .govuk-radios__item:visible > label')
    .contains(label)
    .should('be.visible')
    .and('have.length', 1)
    .parent()
}

export const getCheckbox = (subject: JQuery, label: string) => {
  return cy
    .wrap(subject)
    .find('> .govuk-checkboxes > .govuk-checkboxes__item:visible > label')
    .contains(label)
    .should('be.visible')
    .and('have.length', 1)
    .parent()
}

export const hasRadios = (subject: JQuery, options: string[]) => {
  cy.wrap(subject).find('> .govuk-radios > .govuk-radios__item:visible > label').should('have.length', options.length)

  options.forEach((label, index) => {
    cy.wrap(subject)
      .getRadio(label)
      .isOptionNumber(index + 1)
      .isNotChecked()
  })
  return cy.wrap(subject)
}
