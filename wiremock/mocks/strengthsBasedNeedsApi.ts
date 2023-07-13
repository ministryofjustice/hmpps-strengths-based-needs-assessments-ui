import { faker } from '@faker-js/faker'
import { getFor, postFor } from '../helpers'

const sessionUuid = faker.string.uuid()
const oasysAssessmentUuid = faker.string.uuid()

export default async () => {
  await getFor({
    body: {
      uuid: sessionUuid,
      sessionId: 'MOCK_OASYS_SESSION_ID',
      accessLevel: 'READ_WRITE',
      assessmentUUID: oasysAssessmentUuid,
    },
    urlPattern: `/session/${sessionUuid}`,
  })

  await postFor({
    body: {
      link: `http://localhost:3000/form/sbna-poc/start?sessionId=${sessionUuid}`,
    },
    urlPattern: '/session/create',
  })

  await getFor({
    body: {
      givenName: faker.person.firstName(),
      familyName: faker.person.lastName(),
      dateOfBirth: faker.date.birthdate().toLocaleDateString(),
      crn: faker.helpers.fromRegExp(/D[0-9]{6}/),
      pnc: faker.helpers.fromRegExp(/01-[0-9]{9}A/).replace('-', '/'),
    },
    urlPattern: `/subject/.+?`,
  })
}
