// commands related to navigation and URLs
export const visitSection = (name: string) => {
  return cy.get(`.side-navigation li.moj-side-navigation__item`).contains(name).should('have.length', 1).click()
}

export const visitSectionQuestionSteps = (name: string) => {
  return cy
    .get('.side-navigation li')
    .contains(name)
    .closest('li')
    .next()
    .contains('Questions')
    .should('have.length', 1)
    .click()
}

export const assertSectionIs = (name: string) => {
  cy.get('.side-navigation li.moj-side-navigation__item--active').should('have.length', 1)

  cy.get('.side-navigation li.moj-side-navigation__item--title')
    .contains(name)
    .closest('li')
    .next()
    .should('have.class', 'moj-side-navigation__item--active')

  // Optionally, confirm the main heading includes the section name
  cy.get('h2').should('contain.text', name)
}

export const visitStep = (path: string) => {
  return cy.visit(`/form/1/0${path}`, { retryOnNetworkFailure: false })
}

export const assertResumeUrlIs = (section: string, path: string) => {
  cy.intercept({ query: { action: 'resume' } }).as('resumeRequest')
  cy.visitSectionQuestionSteps(section)
  cy.wait('@resumeRequest')
    .its('response')
    .then(() => cy.assertStepUrlIs(path))
}

export const assertBackLinkIs = (path: string) => {
  cy.get('.govuk-back-link')
    .should('be.visible')
    .invoke('attr', 'href')
    .then((href: string) => {
      expect(href.endsWith(path.charAt(0) === '/' ? path.substring(1) : path)).to.eq(true)
    })
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
