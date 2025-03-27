import { VictimDetails } from './summary'

const enterVictimDetailsWith = (victimDetails: VictimDetails) => {
  cy.getQuestion('Who is the victim?').getRadio(victimDetails.relationship).clickLabel()
  cy.getQuestion("What is the victim's approximate age?").getRadio(victimDetails.age).clickLabel()
  cy.getQuestion("What is the victim's sex?").getRadio(victimDetails.sex).clickLabel()
  cy.getQuestion("What is the victim's ethnicity?").selectOption(victimDetails.raceOrEthnicity)

  cy.saveAndContinue()
}

export default {
  enterVictimDetailsWith,
}
