export const enterSubsection = (subsectionName: string) => {
  return cy.get('.govuk-grid-column-three-quarters a').contains(subsectionName).click()
}

export const enterBackgroundSubsection = () => {
  return cy.get('.govuk-grid-column-three-quarters a').contains('Assessment').click()
}

export const enterPractitionerAnalysisSubsection = () => {
  return cy.get('.govuk-grid-column-three-quarters a').contains('analysis').click()
}
