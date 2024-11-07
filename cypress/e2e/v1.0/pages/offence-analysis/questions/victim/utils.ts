import { VictimDetails } from './summary'

const enterVictimDetailsWith = (victimDetails: VictimDetails) => {
  cy.getQuestion('Who is the victim?').getRadio(victimDetails.relationship).clickLabel()
  cy.getQuestion("What is the victim's approximate age?").getRadio(victimDetails.age).clickLabel()
  cy.getQuestion("What is the victim's sex?").getRadio(victimDetails.sex).clickLabel()
  cy.getQuestion("What is the victim's race or ethnicity?").enterText(`${victimDetails.raceOrEthnicityPartial}{enter}`)

  cy.saveAndContinue()
}

export default {
  enterVictimDetailsWith,
}
