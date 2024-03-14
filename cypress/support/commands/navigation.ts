// commands related to navigation and URLs

import { getQuestion } from './question'

export const visitSection = (name: string) => {
  return cy.get(`.side-navigation li.moj-side-navigation__item`).contains(name).should('have.length', 1).click()
}

export const assertSectionIs = (name: string) => {
  cy.get(`.side-navigation li.moj-side-navigation__item--active`).should('have.length', 1).and('contain.text', name)
  cy.get(`h2`).should('contain.text', name)
}

export const visitStep = (path: string) => {
  return cy.visit(`/form/sbna-poc${path}`)
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
  return cy.location().then(url => {
    getQuestion(question).find(url.hash).should('exist')
  })
}
