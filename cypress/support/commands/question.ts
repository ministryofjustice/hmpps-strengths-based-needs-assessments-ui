// commands that can be chained onto a question

export const getQuestion = (title: string) => {
  return cy
    .get(`form > .form-group, form > .drug > .form-group`)
    .find('> fieldset > legend, > .govuk-form-group > label')
    .contains(title)
    .should('be.visible')
    .and('have.length', 1)
    .closest('fieldset, .govuk-form-group')
}

export const getDrugQuestion = (drug: string, title: string) => {
  return cy
    .get(`form > .drug > h2`)
    .contains(drug)
    .should('have.length', 1)
    .parent()
    .find('> .form-group > fieldset > legend, > .govuk-form-group > label')
    .contains(title)
    .should('be.visible')
    .and('have.length', 1)
    .closest('fieldset, .govuk-form-group')
}

export const hasDrugQuestionGroups = (count: number) => {
  cy.get(`form > .drug`).should('be.visible').and('have.length', count)
  return cy
}

export const hasQuestionsForDrug = (drug: string, count: number) => {
  cy.get(`form > .drug > h2`)
    .contains(drug)
    .should('have.length', 1)
    .parent()
    .find('> .form-group > fieldset > legend, > .govuk-form-group > label')
    .should('be.visible')
    .and('have.length', count)
  return cy
}

export const hasTitle = (subject: JQuery, title: string) => {
  cy.wrap(subject)
    .find('> legend, > label')
    .first()
    .should('be.visible')
    .and('have.length', 1)
    .and('contain.text', title)
  return cy.wrap(subject)
}

export const isQuestionNumber = (subject: JQuery, position: number) => {
  const el = subject
    .parents('form')
    .find('> .form-group')
    .eq(position - 1)
    .find('> fieldset, > .govuk-form-group')
  expect(el, 'this should match to a single element').to.have.lengthOf(1)
  expect(el[0], `the question at position ${position} is not the expected question`).to.eql(subject[0])
  return cy.wrap(subject)
}

export const hasHint = (subject: JQuery, ...hints: string[]) => {
  hints.forEach(hint => {
    if (hint) {
      cy.wrap(subject)
        .children('.govuk-hint:not(.govuk-character-count__message)')
        .should('have.length', 1)
        .and('contain.text', hint)
    } else {
      cy.wrap(subject).children('.govuk-hint:not(.govuk-character-count__message)').should('not.exist')
    }
  })
  return cy.wrap(subject)
}

export const hasLimit = (subject: JQuery, limit: number) => {
  cy.wrap(subject)
    .children('.govuk-character-count__message')
    .should('contain.text', `You have ${limit.toLocaleString()} characters remaining`)
  return cy.wrap(subject)
}

export const hasValidationError = (subject: JQuery, message: string) => {
  cy.wrap(subject)
    .children('.govuk-error-message')
    .should('have.length', 1)
    .first()
    .should('be.visible')
    .and('contain.text', message)
    .invoke('attr', 'id')
    .then((id: string) => {
      cy.get(`.govuk-error-summary a[href="#${id}"]`)
        .should('be.visible')
        .and('have.length', 1)
        .and('contain.text', message)
        .click()
      cy.location('hash').should('eq', `#${id}`)
    })
  return cy.wrap(subject)
}

export const hasNoValidationError = (subject: JQuery) => {
  cy.wrap(subject).children('.govuk-error-message').should('not.exist')
  return cy.wrap(subject)
}

export const getRadio = (subject: JQuery, label: string) => {
  return cy
    .wrap(subject)
    .find('> .govuk-radios > .govuk-radios__item:visible > label')
    .contains(new RegExp(`^\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`))
    .should('be.visible')
    .and('have.length', 1)
    .parent()
}

export const getCheckbox = (subject: JQuery, label: string) => {
  return cy
    .wrap(subject)
    .find('> .govuk-checkboxes > .govuk-checkboxes__item:visible > label')
    .contains(new RegExp(`^\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`))
    .should('be.visible')
    .and('have.length', 1)
    .parent()
}

export const hasRadios = (subject: JQuery, options: string[]) => {
  cy.wrap(subject)
    .find('> .govuk-radios > :not(.govuk-radios__conditional):visible')
    .should('have.length', options.length)

  options.forEach((label, index) => {
    if (label === null) {
      cy.wrap(subject)
        .find('> .govuk-radios > :not(.govuk-radios__conditional):visible')
        .eq(index)
        .should('contain.text', 'or')
        .and('have.class', 'govuk-radios__divider')
    } else {
      cy.wrap(subject)
        .getRadio(label)
        .isOptionNumber(index + 1)
        .isNotChecked()
    }
  })
  return cy.wrap(subject)
}

export const hasCheckboxes = (subject: JQuery, options: string[]) => {
  cy.wrap(subject)
    .find('> .govuk-checkboxes > :not(.govuk-checkboxes__conditional):visible')
    .should('have.length', options.length)

  options.forEach((label, index) => {
    if (label === null) {
      cy.wrap(subject)
        .find('> .govuk-checkboxes > :not(.govuk-checkboxes__conditional):visible')
        .eq(index)
        .should('contain.text', 'or')
        .and('have.class', 'govuk-checkboxes__divider')
    } else {
      cy.wrap(subject)
        .getCheckbox(label)
        .isOptionNumber(index + 1)
        .isNotChecked()
    }
  })
  return cy.wrap(subject)
}

export const enterText = (subject: JQuery, value: string) => {
  cy.wrap(subject).find('textarea, input[type="text"]').first().clear()
  if (value !== '') cy.wrap(subject).find('textarea, input[type="text"]').first().type(value)
  return cy.wrap(subject)
}

const enterDateFieldFor = (subject: JQuery) => (label: string, value: string) =>
  cy
    .wrap(subject)
    .find('.govuk-date-input')
    .find('label')
    .contains(label)
    .invoke('attr', 'for')
    .then(id => cy.get(`#${id}`).should('be.visible').and('have.length', 1).type(value))

export const enterDate = (subject: JQuery, date: string) => {
  const [day, month, year] = date.split('-')

  const enterDateField = enterDateFieldFor(subject)

  enterDateField('Day', day)
  enterDateField('Month', month)
  enterDateField('Year', year)

  return cy.wrap(subject)
}

export const hasText = (subject: JQuery, value: string) => {
  cy.wrap(subject)
    .find('textarea, input[type="text"]')
    .first()
    .invoke('val')
    .then(actualValue => {
      expect(actualValue).to.equal(value)
    })
  return cy.wrap(subject)
}

const hasDateFieldFor = (subject: JQuery) => (label: string, value: string) =>
  cy
    .wrap(subject)
    .find('.govuk-date-input')
    .find('label')
    .contains(label)
    .invoke('attr', 'for')
    .then(id =>
      cy
        .get(`#${id}`)
        .should('be.visible')
        .and('have.length', 1)
        .invoke('val')
        .then(actualValue => {
          expect(actualValue).to.equal(value)
        }),
    )

export const hasDate = (subject: JQuery, date: string) => {
  const [day, month, year] = date.split('-')
  const hasDateField = hasDateFieldFor(subject)

  hasDateField('Day', day)
  hasDateField('Month', month)
  hasDateField('Year', year)

  return cy.wrap(subject)
}

export const selectOption = (subject: JQuery, option: string) => {
  return cy.wrap(subject).get('select').select(option).parent()
}
