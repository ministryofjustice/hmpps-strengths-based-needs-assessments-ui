// commands related to navigation and URLs
export const visitSection = (name: string) => {
  return cy.get(`.side-navigation li.moj-side-navigation__item`).contains(name).should('have.length', 1).click()
}

export const assertSectionIs = (name: string) => {
  cy.get(`.side-navigation li.moj-side-navigation__item--active`).should('have.length', 1).and('contain.text', name)

  // for some sections the name is in the caption, in others the h2
  cy.get('.section-heading__heading').contains(`${name}`).should('be.visible')
}

export const visitStep = (path: string) => {
  const { assessmentId } = Cypress.env('last_assessment')
  return cy.visit(`/form/edit/${assessmentId}${path}`, { retryOnNetworkFailure: false })
}

export const assertResumeUrlIs = (section: string, path: string) => {
  cy.intercept({ query: { action: 'resume' } }).as('resumeRequest')
  cy.visitSection(section)
  cy.log(`asserting resume url is ${path}`)
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
  cy.log(`asserting step url is ${path}`)
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

export const assertDrugQuestionUrl = (drug: string, question) => {
  cy.getDrugQuestion(drug, question).then(q => {
    cy.location('hash').should('satisfy', (id: string) => q.find(id).length === 1)
  })
}
