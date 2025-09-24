export const enterSubsection = (subsectionName: string) => {
  return cy.get('.govuk-grid-column-three-quarters a').contains(subsectionName).click()
}

export const enterBackgroundSubsection = () => {
  return cy.get('.govuk-grid-column-three-quarters a').contains('background').click()
}

export const enterPractitionerAnalysisSubsection = () => {
  return cy.get('form a').contains('analysis').click()
}
