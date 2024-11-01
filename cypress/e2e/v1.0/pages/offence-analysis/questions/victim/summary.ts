export type VictimDetails = {
  relationship: string
  age: string
  sex: string
  raceOrEthnicityPartial: string
  raceOrEthnicity: string
}

export const assertVictimEntry = (victimNumber: number, victimDetails: VictimDetails) => {
  cy.getCollectionEntry('victim', victimNumber).within(() => {
    cy.getSummary("Who is the victim?").getAnswer(victimDetails.relationship)

    cy.getSummary("What is the victim's approximate age?").getAnswer(victimDetails.age)

    cy.getSummary("What is the victim's sex?").getAnswer(victimDetails.sex)

    cy.getSummary("What is the victim's race or ethnicity?").getAnswer(victimDetails.raceOrEthnicity)
  })
}
