import { createAssessment, fetchAssessment } from './api'

export const enum Fixture {
  CompleteAssessment = 'complete-assessment',
  DrugUser = 'drug-user',
}

export const saveAsFixture = (fixture: Fixture) =>
  fetchAssessment().then(response => cy.writeFile(`cypress/fixtures/${fixture.valueOf()}.json`, response.body))

export const loadFixture = (fixture: Fixture) => cy.fixture(fixture.valueOf()).then(data => createAssessment(data))
