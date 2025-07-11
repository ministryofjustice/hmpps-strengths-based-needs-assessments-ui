import { Fixture } from '../../support/commands/fixture'

describe('assessment print preview', () => {
  before(() => {
    cy.loadFixture(Fixture.CompleteAssessment)
  })

  it('all answers are visible', () => {
    cy.enterAssessment()

    cy.get('.print-link').should('contain.text', 'View all answers').click()
    cy.assertStepUrlIs('print-preview')

    cy.get('h1').should('contain.text', `Sam's strengths and needs`)

    const sections = {
      Accommodation: true,
      'Employment and education': true,
      Finances: true,
      'Drug use': true,
      'Alcohol use': true,
      'Health and wellbeing': true,
      'Personal relationships and community': true,
      'Thinking, behaviours and attitudes': true,
      'Offence analysis': false,
    }

    Object.entries(sections).forEach(([section, hasPractitionerAnalysis]) => {
      cy.get(`h2:contains(${section})`)
        .should('have.length', 1)
        .closest('.pdf-avoid-break')
        .within(() => {
          cy.get('h3:contains(Summary)').should('have.length', 1)
          cy.get('.summary-section-header__status').should('have.length', 1).and('contain.text', 'Complete')

          if (hasPractitionerAnalysis) cy.get('h3:contains(Practitioner analysis)').should('have.length', 1)
          else cy.get('h3:contains(Practitioner analysis)').should('not.exist')

          const sectionName = section.toLowerCase()
          const subjectPrefix = sectionName.endsWith('s') ? 'Are' : 'Is'

          const practitionerAnalysisQuestions = [
            `Are there any strengths or protective factors related to Sam's ${section.toLowerCase()}?`,
            `${subjectPrefix} Sam's ${sectionName} linked to risk of serious harm?`,
            `${subjectPrefix} Sam's ${sectionName} linked to risk of reoffending?`,
          ]

          practitionerAnalysisQuestions.forEach(question => {
            if (hasPractitionerAnalysis) cy.getSummary(question).getAnswer('No').hasNoSecondaryAnswer()
            else cy.contains(question).should('not.exist')
          })
        })
    })

    // accommodation
    cy.getSummary('What type of accommodation does Sam currently have?')
      .getAnswer('Settled')
      .hasSecondaryAnswer('Homeowner')
    cy.getSummary('Who is Sam living with?').getAnswer('Alone').hasNoSecondaryAnswer()
    cy.getSummary("Is the location of Sam's accommodation suitable?").getAnswer('Yes').hasNoSecondaryAnswer()
    cy.getSummary("Is Sam's accommodation suitable?").getAnswer('Yes').hasNoSecondaryAnswer()
    cy.getSummary('Does Sam want to make changes to their accommodation?')
      .getAnswer('Not applicable')
      .hasNoSecondaryAnswer()

    // employment and education
    cy.getSummary("What is Sam's current employment status?").getAnswer('Retired').hasNoSecondaryAnswer()
    cy.getSummary("What is Sam's employment history?").getAnswer('Continuous employment history').hasNoSecondaryAnswer()
    cy.getSummary('Does Sam have any additional day-to-day commitments?').getAnswer('Studying').hasNoSecondaryAnswer()
    cy.getSummary('Select the highest level of academic qualification Sam has completed')
      .getAnswer('Entry level')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam have any professional or vocational qualifications?').getAnswer('No').hasNoSecondaryAnswer()
    cy.getSummary('Does Sam have any skills that could help them in a job or to get a job?')
      .getAnswer('No')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam have difficulties with reading, writing or numeracy?')
      .getAnswer('Yes, with reading')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam have difficulties with reading, writing or numeracy?')
      .getAnswer('Yes, with reading')
      .hasSecondaryAnswer('Some difficulties')
    cy.getSummary('Does Sam want to make changes to their employment and education?')
      .getAnswer('Not applicable')
      .hasNoSecondaryAnswer()

    // finance
    cy.getSummary('Where does Sam currently get their money from?').getAnswer('Pension').hasNoSecondaryAnswer()
    cy.getSummary('Does Sam have their own bank account?').getAnswer('No').hasNoSecondaryAnswer()
    cy.getSummary('How good is Sam at managing their money?')
      .getAnswer('Unable to manage their money which is creating other problems')
      .hasNoSecondaryAnswer()
    cy.getSummary('Is Sam affected by gambling?').getAnswer('No').hasNoSecondaryAnswer()
    cy.getSummary('Is Sam affected by debt?').getAnswer('No').hasNoSecondaryAnswer()
    cy.getSummary('Does Sam want to make changes to their finances?').getAnswer('Not applicable').hasNoSecondaryAnswer()

    // drugs
    cy.getSummary('Has Sam ever misused drugs?').getAnswer('No').hasNoSecondaryAnswer()

    // alcohol
    cy.getSummary('Has Sam ever drunk alcohol?').getAnswer('No').hasNoSecondaryAnswer()

    // health and wellbeing
    cy.getSummary('Does Sam have any physical health conditions?').getAnswer('No').hasNoSecondaryAnswer()
    cy.getSummary('Does Sam have any diagnosed or documented mental health problems?')
      .getAnswer('No')
      .hasNoSecondaryAnswer()
    cy.getSummary('Has Sam had a head injury or any illness affecting the brain?')
      .getAnswer('No')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam have any neurodiverse conditions?').getAnswer('No').hasNoSecondaryAnswer()
    cy.getSummary('Does Sam have any conditions or disabilities that impact their ability to learn? (optional)')
      .getAnswer('No, they do not have any conditions or disabilities that impact their ability to learn')
      .hasNoSecondaryAnswer()
    cy.getSummary('Is Sam able to cope with day-to-day life?').getAnswer('Not able to cope').hasNoSecondaryAnswer()
    cy.getSummary("What is Sam's attitude towards themselves?")
      .getAnswer('Positive and reasonably happy')
      .hasNoSecondaryAnswer()
    cy.getSummary('Has Sam ever self-harmed?').getAnswer('No').hasNoSecondaryAnswer()
    cy.getSummary('Has Sam ever attempted suicide or had suicidal thoughts?').getAnswer('No').hasNoSecondaryAnswer()
    cy.getSummary('How does Sam feel about their future?').getAnswer('Sam is not present').hasNoSecondaryAnswer()
    cy.getSummary("What's helped Sam during periods of good health and wellbeing? (optional)")
      .getAnswer('Money')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam want to make changes to their health and wellbeing?')
      .getAnswer('Not applicable')
      .hasNoSecondaryAnswer()

    // personal relationships and community
    cy.getSummary("Who are the important people in Sam's life?").getAnswer('Friends').hasNoSecondaryAnswer()
    cy.getSummary('Is Sam happy with their current relationship status?')
      .getAnswer(
        'Happy and positive about their relationship status or their relationship is likely to act as a protective factor',
      )
      .hasNoSecondaryAnswer()
    cy.getSummary("What is Sam's history of intimate relationships?")
      .getAnswer('History of stable, supportive, positive and rewarding relationships')
      .hasNoSecondaryAnswer()
    cy.getSummary('Is Sam able to resolve any challenges in their intimate relationships?')
      .getAnswer('¯\\_(ツ)_/¯')
      .hasNoSecondaryAnswer()
    cy.getSummary("What is Sam's current relationship like with their family?")
      .getAnswer('Unknown')
      .hasNoSecondaryAnswer()
    cy.getSummary("What was Sam's experience of their childhood?")
      .getAnswer('Positive experience')
      .hasNoSecondaryAnswer()
    cy.getSummary('Did Sam have any childhood behavioural problems?').getAnswer('No').hasNoSecondaryAnswer()
    cy.getSummary('Does Sam want to make changes to their personal relationships and community?')
      .getAnswer('Not applicable')
      .hasNoSecondaryAnswer()

    //  thinking, behaviours and attitudes
    cy.getSummary('Is Sam aware of the consequences of their actions?')
      .getAnswer('Sometimes is aware of the consequences of their actions')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam show stable behaviour?')
      .getAnswer('Sometimes shows stable behaviour but can show reckless or risk taking behaviours')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam engage in activities that could link to offending?')
      .getAnswer('Sometimes engages in activities linked to offending but recognises the link')
      .hasNoSecondaryAnswer()
    cy.getSummary('Is Sam resilient towards peer pressure or influence by criminal associates?')
      .getAnswer(
        'Has been peer pressured or influenced by criminal associates in the past but recognises the link to their offending',
      )
      .hasNoSecondaryAnswer()
    cy.getSummary('Is Sam able to solve problems in a positive way?')
      .getAnswer('Has limited problem solving skills')
      .hasNoSecondaryAnswer()
    cy.getSummary("Does Sam understand other people's views?")
      .getAnswer(
        "Assumes all views are the same as theirs at first but does consider other people's views to an extent",
      )
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam show manipulative behaviour or a predatory lifestyle?')
      .getAnswer(
        'Some evidence that they show manipulative behaviour or act in a predatory way towards certain individuals',
      )
      .hasNoSecondaryAnswer()
    cy.getSummary('Are there any concerns that Sam poses a risk of sexual harm to others?')
      .getAnswer('No')
      .hasNoSecondaryAnswer()
    cy.getSummary('Is Sam able to manage their temper?')
      .getAnswer('Sometimes has outbreaks of uncontrolled anger')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam use violence, aggressive or controlling behaviour to get their own way?')
      .getAnswer('Some evidence of using violence, aggressive or controlling behaviour to get their own way')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam act on impulse?')
      .getAnswer('Sometimes acts on impulse which causes problems')
      .hasNoSecondaryAnswer()
    cy.getSummary(
      'Does Sam have a positive attitude towards any criminal justice staff they have come into contact with?',
    )
      .getAnswer('Has a negative attitude or does not fully engage but there are no safety concerns')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam have hostile orientation to others or to general rules?')
      .getAnswer('Some evidence of suspicious, angry or vengeful thinking and behaviour')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam accept supervision and their licence conditions?')
      .getAnswer('Unsure about supervision and has put minimum effort into supervision in the past')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam support or excuse criminal behaviour?')
      .getAnswer('Sometimes supports or excuses criminal behaviour')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam want to make changes to their thinking, behaviours and attitudes?')
      .getAnswer('Not applicable')
      .hasNoSecondaryAnswer()

    // offence analysis
    cy.getSummary('Enter a brief description of the current index offence(s)')
      .getAnswer('¯\\_(ツ)_/¯')
      .hasNoSecondaryAnswer()
    cy.getSummary('Did the current index offence(s) have any of the following elements?')
      .getAnswer('Arson')
      .hasNoSecondaryAnswer()
    cy.getSummary('Why did the current index offence(s) happen?').getAnswer('¯\\_(ツ)_/¯').hasNoSecondaryAnswer()
    cy.getSummary('Did the current index offence(s) involve any of the following motivations?')
      .getAnswer('Thrill seeking')
      .hasNoSecondaryAnswer()
    cy.getSummary('Who was the offence committed against?').getAnswer('Other').hasSecondaryAnswer('¯\\_(ツ)_/¯')
    cy.getSummary('How many other people were involved with committing the current index offence(s)?')
      .getAnswer('None')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam recognise the impact or consequences on the victims or others and the wider community?')
      .getAnswer('No')
      .hasNoSecondaryAnswer()
    cy.getSummary('Does Sam accept responsibility for the current index offence(s)?')
      .getAnswer('No')
      .hasNoSecondaryAnswer()
    cy.getSummary('What are the patterns of offending?').getAnswer('¯\\_(ツ)_/¯').hasNoSecondaryAnswer()
    cy.getSummary('Is the current index offence(s) an escalation in seriousness from previous offending?')
      .getAnswer('No')
      .hasNoSecondaryAnswer()
    cy.getSummary(
      'Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?',
    )
      .getAnswer('No')
      .hasSecondaryAnswer('¯\\_(ツ)_/¯')
    cy.getSummary('Is there evidence that Sam has ever been a perpetrator of domestic abuse?')
      .getAnswer('No')
      .hasNoSecondaryAnswer()
    cy.getSummary('Is there evidence that Sam has ever been a victim of domestic abuse?')
      .getAnswer('No')
      .hasNoSecondaryAnswer()
  })
})
