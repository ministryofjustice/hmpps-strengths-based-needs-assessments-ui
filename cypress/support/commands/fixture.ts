import { createAssessment, fetchAssessment } from './api'

// eslint-disable-next-line no-shadow
export const enum Fixture {
  CompleteAssessment = 'complete-assessment',
}

export const saveAsFixture = (fixture: Fixture) =>
  fetchAssessment().then(response => cy.writeFile(`cypress/fixtures/${fixture.valueOf()}.json`, response.body))

export const loadFixture = (fixture: Fixture) => cy.fixture(fixture.valueOf()).then(data => createAssessment(data))
