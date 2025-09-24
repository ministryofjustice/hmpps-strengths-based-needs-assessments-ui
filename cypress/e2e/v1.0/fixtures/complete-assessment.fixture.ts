import { Fixture } from '../../../support/commands/fixture'

describe('Generate fixture for complete assessment', () => {
  before(() => {
    cy.createAssessment()
  })

  beforeEach(() => {
    cy.enterAssessment()
  })

  after(() => {
    cy.saveAsFixture(Fixture.CompleteAssessment)
  })

  const completePractitionerAnalysisFor = (sectionName: string) => {
    cy.get('#tab_practitioner-analysis').click()
    cy.get('#practitioner-analysis').should('be.visible')

    const sectionNameLowerCase = sectionName.toLowerCase()
    const subjectPrefix = sectionName.endsWith('s') ? 'Are' : 'Is'

    Array.of(
      `Are there any strengths or protective factors related to Sam's ${sectionName.toLowerCase()}?`,
      `${subjectPrefix} Sam's ${sectionNameLowerCase} linked to risk of serious harm?`,
      `${subjectPrefix} Sam's ${sectionNameLowerCase} linked to risk of reoffending?`,
    ).forEach(question => {
      cy.getQuestion(question).getRadio('No').clickLabel()
    })

    cy.markAsComplete()
  }

  it('completes the accommodation section', () => {
    const section = 'Accommodation'

    cy.visitSection(section)
    cy.getQuestion('What type of accommodation does Sam currently have?').getRadio('Settled').clickLabel()
    cy.getQuestion('What type of accommodation does Sam currently have?')
      .getRadio('Settled')
      .getConditionalQuestion()
      .getRadio('Homeowner')
      .clickLabel()
    cy.saveAndContinue()

    cy.getQuestion('Who is Sam living with?').getCheckbox('Alone').clickLabel()
    cy.getQuestion("Is the location of Sam's accommodation suitable?").getRadio('Yes').clickLabel()
    cy.getQuestion("Is Sam's accommodation suitable?").getRadio('Yes').clickLabel()
    cy.getQuestion('Does Sam want to make changes to their accommodation?').getRadio('Not applicable').clickLabel()
    cy.saveAndContinue()

    completePractitionerAnalysisFor(section)
    cy.sectionMarkedAsComplete(section)
  })

  it('completes the employment and education section', () => {
    const section = 'Employment and education'
    cy.visitSection(section)
    cy.getQuestion("What is Sam's current employment status?").getRadio('Retired').clickLabel()
    cy.saveAndContinue()

    cy.getQuestion("What is Sam's employment history?").getRadio('Continuous employment history').clickLabel()
    cy.getQuestion('Does Sam have any additional day-to-day commitments?').getCheckbox('Studying').clickLabel()
    cy.getQuestion('Select the highest level of academic qualification Sam has completed')
      .getRadio('Entry level')
      .clickLabel()
    cy.getQuestion('Does Sam have any professional or vocational qualifications?').getRadio('No').clickLabel()
    cy.getQuestion('Does Sam have any skills that could help them in a job or to get a job?')
      .getRadio('No')
      .clickLabel()
    cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
      .getCheckbox('Yes, with reading')
      .clickLabel()
    cy.getQuestion('Does Sam have difficulties with reading, writing or numeracy?')
      .getCheckbox('Yes, with reading')
      .getConditionalQuestion()
      .getRadio('Some difficulties')
      .clickLabel()
    cy.getQuestion('Does Sam want to make changes to their employment and education?')
      .getRadio('Not applicable')
      .clickLabel()
    cy.saveAndContinue()

    completePractitionerAnalysisFor(section)
    cy.sectionMarkedAsComplete(section)
  })

  it('completes the finance section', () => {
    const section = 'Finances'

    cy.visitSection(section)
    cy.getQuestion('Where does Sam currently get their money from?').getCheckbox('Pension').clickLabel()
    cy.getQuestion('Does Sam have their own bank account?').getRadio('No').clickLabel()
    cy.getQuestion('How good is Sam at managing their money?')
      .getRadio('Unable to manage their money which is creating other problems')
      .clickLabel()
    cy.getQuestion('Is Sam affected by gambling?').getCheckbox('No').clickLabel()
    cy.getQuestion('Is Sam affected by debt?').getCheckbox('No').clickLabel()
    cy.getQuestion('Does Sam want to make changes to their finances?').getRadio('Not applicable').clickLabel()
    cy.saveAndContinue()

    completePractitionerAnalysisFor(section)
    cy.sectionMarkedAsComplete(section)
  })

  it('completes the drug section', () => {
    const section = 'Drug use'

    cy.visitSection(section)
    cy.getQuestion('Has Sam ever misused drugs?').getRadio('No').clickLabel()
    cy.saveAndContinue()

    completePractitionerAnalysisFor(section)
    cy.sectionMarkedAsComplete(section)
  })

  it('completes the alcohol section', () => {
    const section = 'Alcohol use'

    cy.visitSection(section)
    cy.getQuestion('Has Sam ever drunk alcohol?').getRadio('No').clickLabel()
    cy.saveAndContinue()

    completePractitionerAnalysisFor(section)
    cy.sectionMarkedAsComplete(section)
  })

  it('completes the health and wellbeing section', () => {
    const section = 'Health and wellbeing'

    cy.visitSection(section)
    cy.getQuestion('Does Sam have any physical health conditions?').getRadio('No').clickLabel()
    cy.getQuestion('Does Sam have any diagnosed or documented mental health problems?').getRadio('No').clickLabel()
    cy.saveAndContinue()

    cy.getQuestion('Has Sam had a head injury or any illness affecting the brain?').getRadio('No').clickLabel()
    cy.getQuestion('Does Sam have any neurodiverse conditions?').getRadio('No').clickLabel()
    cy.getQuestion('Does Sam have any conditions or disabilities that impact their ability to learn? (optional)')
      .getRadio('No, they do not have any conditions or disabilities that impact their ability to learn')
      .clickLabel()
    cy.getQuestion('Is Sam able to cope with day-to-day life?').getRadio('Not able to cope').clickLabel()
    cy.getQuestion("What is Sam's attitude towards themselves?").getRadio('Positive and reasonably happy').clickLabel()
    cy.getQuestion('Has Sam ever self-harmed?').getRadio('No').clickLabel()
    cy.getQuestion('Has Sam ever attempted suicide or had suicidal thoughts?').getRadio('No').clickLabel()
    cy.getQuestion('How does Sam feel about their future?').getRadio('Sam is not present').clickLabel()
    cy.getQuestion("What's helped Sam during periods of good health and wellbeing? (optional)")
      .getCheckbox('Money')
      .clickLabel()
    cy.getQuestion('Does Sam want to make changes to their health and wellbeing?')
      .getRadio('Not applicable')
      .clickLabel()
    cy.saveAndContinue()

    completePractitionerAnalysisFor(section)
    cy.sectionMarkedAsComplete(section)
  })

  it('completes the personal relationships and community section', () => {
    const section = 'Personal relationships and community'

    cy.visitSection(section)
    cy.getQuestion("Are there any children in Sam's life?")
      .getCheckbox("No, there are no children in Sam's life")
      .clickLabel()
    cy.saveAndContinue()

    cy.getQuestion("Who are the important people in Sam's life?").getCheckbox('Friends').clickLabel()
    cy.saveAndContinue()

    cy.getQuestion('Is Sam happy with their current relationship status?')
      .getRadio(
        'Happy and positive about their relationship status or their relationship is likely to act as a protective factor',
      )
      .clickLabel()
    cy.getQuestion("What is Sam's history of intimate relationships?")
      .getRadio('History of stable, supportive, positive and rewarding relationships')
      .clickLabel()
    cy.getQuestion('Is Sam able to resolve any challenges in their intimate relationships?').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion("What is Sam's current relationship like with their family?").getRadio('Unknown').clickLabel()
    cy.getQuestion("What was Sam's experience of their childhood?").getRadio('Positive experience').clickLabel()
    cy.getQuestion('Did Sam have any childhood behavioural problems?').getRadio('No').clickLabel()
    cy.getQuestion('Does Sam want to make changes to their personal relationships and community?')
      .getRadio('Not applicable')
      .clickLabel()
    cy.saveAndContinue()

    completePractitionerAnalysisFor(section)
    cy.sectionMarkedAsComplete(section)
  })

  it('completes the thinking, behaviours and attitudes section', () => {
    const section = 'Thinking, behaviours and attitudes'

    cy.visitSection(section)
    cy.getQuestion('Is Sam aware of the consequences of their actions?')
      .getRadio('Sometimes is aware of the consequences of their actions')
      .clickLabel()
    cy.getQuestion('Does Sam show stable behaviour?')
      .getRadio('Sometimes shows stable behaviour but can show reckless or risk taking behaviours')
      .clickLabel()
    cy.getQuestion('Does Sam engage in activities that could link to offending?')
      .getRadio('Sometimes engages in activities linked to offending but recognises the link')
      .clickLabel()
    cy.getQuestion('Is Sam resilient towards peer pressure or influence by criminal associates?')
      .getRadio(
        'Has been peer pressured or influenced by criminal associates in the past but recognises the link to their offending',
      )
      .clickLabel()
    cy.getQuestion('Is Sam able to solve problems in a positive way?')
      .getRadio('Has limited problem solving skills')
      .clickLabel()
    cy.getQuestion("Does Sam understand other people's views?")
      .getRadio("Assumes all views are the same as theirs at first but does consider other people's views to an extent")
      .clickLabel()
    cy.getQuestion('Does Sam show manipulative behaviour or a predatory lifestyle?')
      .getRadio(
        'Some evidence that they show manipulative behaviour or act in a predatory way towards certain individuals',
      )
      .clickLabel()
    cy.getQuestion('Is Sam able to manage their temper?')
      .getRadio('Sometimes has outbreaks of uncontrolled anger')
      .clickLabel()
    cy.getQuestion('Does Sam use violence, aggressive or controlling behaviour to get their own way?')
      .getRadio('Some evidence of using violence, aggressive or controlling behaviour to get their own way')
      .clickLabel()
    cy.getQuestion('Does Sam act on impulse?').getRadio('Sometimes acts on impulse which causes problems').clickLabel()
    cy.getQuestion(
      'Does Sam have a positive attitude towards any criminal justice staff they have come into contact with?',
    )
      .getRadio('Has a negative attitude or does not fully engage but there are no safety concerns')
      .clickLabel()
    cy.getQuestion('Does Sam have hostile orientation to others or to general rules?')
      .getRadio('Some evidence of suspicious, angry or vengeful thinking and behaviour')
      .clickLabel()
    cy.getQuestion('Does Sam accept supervision and their licence conditions?')
      .getRadio('Unsure about supervision and has put minimum effort into supervision in the past')
      .clickLabel()
    cy.getQuestion('Does Sam support or excuse criminal behaviour?')
      .getRadio('Sometimes supports or excuses criminal behaviour')
      .clickLabel()
    cy.getQuestion('Does Sam want to make changes to their thinking, behaviours and attitudes?')
      .getRadio('Not applicable')
      .clickLabel()
    cy.saveAndContinue()

    cy.getQuestion('Are there any concerns that Sam poses a risk of sexual harm to others?').getRadio('No').clickLabel()
    cy.saveAndContinue()

    completePractitionerAnalysisFor(section)
    cy.sectionMarkedAsComplete(section)
  })

  it('completes the offence analysis section', () => {
    const section = 'Offence analysis'

    cy.visitSection(section)
    cy.getQuestion('Enter a brief description of the current index offence(s)').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Did the current index offence(s) have any of the following elements?')
      .getCheckbox('Arson')
      .clickLabel()
    cy.getQuestion('Why did the current index offence(s) happen?').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Did the current index offence(s) involve any of the following motivations?')
      .getCheckbox('Thrill seeking')
      .clickLabel()
    cy.getQuestion('Who was the offence committed against?').getCheckbox('Other').clickLabel()
    cy.getQuestion('Who was the offence committed against?')
      .getCheckbox('Other')
      .getConditionalQuestion()
      .enterText('¯\\_(ツ)_/¯')
    cy.saveAndContinue()

    cy.getQuestion('How many other people were involved with committing the current index offence(s)?')
      .getRadio('None')
      .clickLabel()
    cy.saveAndContinue()

    cy.getQuestion('Does Sam recognise the impact on the victims or wider community?').getRadio('No').clickLabel()
    cy.getQuestion('Does Sam accept responsibility for the current index offence(s)?').getRadio('No').clickLabel()
    cy.getQuestion('What are the patterns of offending?').enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Is there an escalation in seriousness from previous offending?').getRadio('No').clickLabel()
    cy.getQuestion(
      'Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?',
    )
      .getRadio('No')
      .clickLabel()
    cy.getQuestion(
      'Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?',
    )
      .getRadio('No')
      .getConditionalQuestion()
      .enterText('¯\\_(ツ)_/¯')
    cy.getQuestion('Is there evidence that Sam has ever been a perpetrator of domestic abuse?')
      .getRadio('No')
      .clickLabel()
    cy.getQuestion('Is there evidence that Sam has ever been a victim of domestic abuse?').getRadio('No').clickLabel()
    cy.markAsComplete()

    cy.sectionMarkedAsComplete(section)
  })
})
