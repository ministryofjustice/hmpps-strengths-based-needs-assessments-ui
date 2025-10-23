import { backgroundSubsectionName, practitionerAnalysisSubsectionName } from '../../e2e/v1.0/journeys/common'

export const enterSubsection = (subsectionName: string) => {
  return cy.get('.govuk-grid-column-three-quarters a').contains(subsectionName).click()
}

export const enterBackgroundSubsection = () => {
  return cy.get('.govuk-grid-column-three-quarters a').contains(backgroundSubsectionName).click()
}

export const enterPractitionerAnalysisSubsection = () => {
  return cy.get('.govuk-grid-column-three-quarters a').contains(practitionerAnalysisSubsectionName).click()
}
