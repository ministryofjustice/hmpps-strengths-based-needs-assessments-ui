import {
  drugDetailsInjectedBefore,
  drugDetailsInjectedBeforeEach,
  questions,
  stepUrl,
  summaryPage,
} from './common/drug-details-injected-setup'

describe('/drug-details-injected questions', () => {
  before(drugDetailsInjectedBefore(stepUrl, questions))
  beforeEach(drugDetailsInjectedBeforeEach(stepUrl))

  // verifies the behaviour of questions
  questions.forEach((questionTest, index) => {
    questionTest(stepUrl, summaryPage, index + 1)
  })
})
