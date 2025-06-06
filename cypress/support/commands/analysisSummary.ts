export const getAnalysisSummary = (question: string) => {
  return cy
    .get('#practitioner-analysis > section > article > .analysis-summary__row > .analysis-summary__heading')
    .contains(question)
    .should('be.visible')
    .and('have.length', 1)
    .closest('article')
}

export const clickChangeAnalysis = (subject: JQuery) => {
  cy.wrap(subject).find('.govuk-link').should('be.visible').and('have.length', 1).and('contain.text', 'Change').click()
}

export const getAnalysisAnswer = (subject: JQuery, answer: string) => {
  return cy
    .wrap(subject)
    .find('> .analysis-summary__row > .analysis-summary__value > ul > li > .analysis__answer')
    .contains(answer)
    .should('be.visible')
    .and('have.length', 1)
    .parent()
}

export const hasSecondaryAnalysisAnswer = (subject: JQuery, ...lines: string[]) => {
  cy.wrap(subject)
    .find('> .analysis__answer--secondary > br')
    .should('have.length', lines.length - 1)

  lines.forEach(line => {
    cy.wrap(subject)
      .children('.analysis__answer--secondary')
      .should('be.visible')
      .and('have.length', 1)
      .and('contain.text', line)
  })

  return cy.wrap(subject)
}

export const hasNoSecondaryAnalysisAnswer = (subject: JQuery) => {
  cy.wrap(subject).children('.analysis__answer--secondary').should('not.exist')
  return cy.wrap(subject)
}
