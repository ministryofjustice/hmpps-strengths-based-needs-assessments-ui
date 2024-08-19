// commands related to navigation and URLs
export const visitSection = (name: string) => {
  return cy.get(`.side-navigation li.moj-side-navigation__item`).contains(name).should('have.length', 1).click()
}

export const assertSectionIs = (name: string) => {
  cy.get(`.side-navigation li.moj-side-navigation__item--active`).should('have.length', 1).and('contain.text', name)
  cy.get(`h2`).should('contain.text', name)
}

export const visitStep = (path: string) => {
  return cy.visit(`/form/1/0${path}`, { retryOnNetworkFailure: false })
}

export const assertResumeUrlIs = (section: string, path: string) => {
  cy.intercept({ query: { action: 'resume' } }).as('resumeRequest')
  cy.visitSection(section)
  cy.wait('@resumeRequest')
    .its('response')
    .then(() => cy.assertStepUrlIs(path))
}

export const assertStepUrlIs = (path: string) => {
  return cy
    .location()
    .should(url => expect(url.pathname.endsWith(path), `${url.pathname} should end with ${path}`).to.be.true)
}

export const assertStepUrlIsNot = (path: string) => {
  return cy
    .location()
    .should(url => expect(url.pathname.endsWith(path), `${url.pathname} should not end with ${path}`).to.be.false)
}

export const assertQuestionUrl = (question: string) => {
  cy.getQuestion(question).then(q => {
    cy.location('hash').should('satisfy', (id: string) => q.find(id).length === 1)
  })
}

export const assertDrugQuestionGroupUrl = (drug: string) => {
  return cy.location().then(url => {
    cy.get('form').children(url.hash).should('be.visible').and('have.length', 1).children('h2').contains(drug)
  })
}
