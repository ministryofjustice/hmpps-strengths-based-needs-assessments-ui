import { Fixture } from '../../../support/commands/fixture'
import { AccessMode } from '../../../support/commands/api'

describe('History of Sexually Motivated Offence conditional logic', () => {
  const destinations = {
    riskOfSexualHarm: 'thinking-behaviours-attitudes-risk-of-sexual-harm',
    riskOfSexualHarmDetails: 'thinking-behaviours-attitudes-risk-of-sexual-harm-details',
    summary: '/thinking-behaviours-attitudes-summary',
  }

  const sectionName = 'Thinking, behaviours and attitudes'
  const question = 'Are there any concerns that Sam poses a risk of sexual harm to others?'
  const hint = 'Sam does not have any current or previous sexual or sexually motivated offences'

  describe('SAN value is NO', () => {
    beforeEach(() => {
      cy.loadFixture(Fixture.CompleteAssessment)
      cy.enterAssessment()
      cy.sectionMarkedAsComplete(sectionName)
      cy.assessmentMarkedAsComplete()
      cy.visitSection(sectionName)
      cy.getSummary(question).getAnswer('No')
    })

    it('YES from Oasys overrides SAN', () => {
      cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: 'YES' })
      cy.sectionNotMarkedAsComplete(sectionName)
      cy.assessmentNotMarkedAsComplete()

      cy.visitStep(destinations.riskOfSexualHarm)
      cy.getQuestion(question).hasHint(null).getRadio('Yes').isChecked()
      cy.getQuestion(question).getRadio('No').isDisabled()
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.riskOfSexualHarmDetails)
    })

    it('NO from Oasys does not override SAN', () => {
      cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: 'NO' })
      cy.sectionMarkedAsComplete(sectionName)
      cy.assessmentMarkedAsComplete()
      cy.visitStep(destinations.riskOfSexualHarm)
      cy.getQuestion(question).hasHint(hint).getRadio('No').isChecked()
      cy.getQuestion(question).getRadio('Yes').isNotDisabled()
    })

    it('NULL from Oasys does not override SAN', () => {
      cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: null })
      cy.sectionMarkedAsComplete(sectionName)
      cy.assessmentMarkedAsComplete()
      cy.visitStep(destinations.riskOfSexualHarm)
      cy.getQuestion(question).hasHint(null).getRadio('No').isChecked()
      cy.getQuestion(question).getRadio('Yes').isNotDisabled()
    })
  })

  describe('SAN value is YES', () => {
    before(() => {
      cy.loadFixture(Fixture.CompleteAssessment)
      cy.enterAssessment()
      cy.visitStep(destinations.riskOfSexualHarm)
      cy.getQuestion(question).getRadio('Yes').clickLabel()
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.riskOfSexualHarmDetails)
      cy.getQuestion('Is there evidence Sam shows sexual preoccupation?').getRadio('Unknown').clickLabel()
      cy.getQuestion('Is there evidence Sam has offence-related sexual interests?').getRadio('Unknown').clickLabel()
      cy.getQuestion('Is there evidence Sam finds it easier to seek emotional intimacy with children over adults?')
        .getRadio('Unknown')
        .clickLabel()
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.summary)
      cy.saveAndContinue()
      cy.assertStepUrlIs(destinations.summary)
      cy.get('#tab_practitioner-analysis').click()
      cy.markAsComplete()
      cy.sectionMarkedAsComplete(sectionName)
      cy.assessmentMarkedAsComplete()
      cy.captureAssessment()
    })

    beforeEach(() => {
      cy.cloneCapturedAssessment()
    })

    it('YES from Oasys does not override SAN', () => {
      cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: 'YES' })
      cy.sectionMarkedAsComplete(sectionName)
      cy.assessmentMarkedAsComplete()
      cy.visitStep(destinations.riskOfSexualHarm)
      cy.getQuestion(question).hasHint(null).getRadio('Yes').isChecked()
      cy.getQuestion(question).getRadio('No').isDisabled()
    })

    it('NO from Oasys does not override SAN', () => {
      cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: 'NO' })
      cy.sectionMarkedAsComplete(sectionName)
      cy.assessmentMarkedAsComplete()
      cy.visitStep(destinations.riskOfSexualHarm)
      cy.getQuestion(question).hasHint(hint).getRadio('Yes').isChecked()
      cy.getQuestion(question).getRadio('No').isNotDisabled()
    })

    it('NULL from Oasys does not override SAN', () => {
      cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: null })
      cy.sectionMarkedAsComplete(sectionName)
      cy.assessmentMarkedAsComplete()
      cy.visitStep(destinations.riskOfSexualHarm)
      cy.getQuestion(question).hasHint(null).getRadio('Yes').isChecked()
      cy.getQuestion(question).getRadio('No').isNotDisabled()
    })
  })

  describe('SAN value is NULL', () => {
    beforeEach(() => {
      cy.createAssessment()
    })

    it('YES from Oasys overrides SAN', () => {
      cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: 'YES' })
      cy.sectionNotMarkedAsComplete(sectionName)
      cy.visitStep(destinations.riskOfSexualHarm)
      cy.getQuestion(question).hasHint(null).getRadio('Yes').isChecked()
      cy.getQuestion(question).getRadio('No').isDisabled()
    })

    it('NO from Oasys does not override SAN', () => {
      cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: 'NO' })
      cy.sectionNotMarkedAsComplete(sectionName)
      cy.visitStep(destinations.riskOfSexualHarm)
      cy.getQuestion(question).hasHint(hint).getRadio('Yes').isNotDisabled().isNotChecked()
      cy.getQuestion(question).getRadio('No').isNotDisabled().isNotChecked()
    })

    it('NULL from Oasys does not override SAN', () => {
      cy.enterAssessment(AccessMode.READ_WRITE, { sexuallyMotivatedOffenceHistory: null })
      cy.sectionNotMarkedAsComplete(sectionName)
      cy.visitStep(destinations.riskOfSexualHarm)
      cy.getQuestion(question).hasHint(null).getRadio('Yes').isNotDisabled().isNotChecked()
      cy.getQuestion(question).getRadio('No').isNotDisabled().isNotChecked()
    })
  })
})
