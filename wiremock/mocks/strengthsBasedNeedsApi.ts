import { faker } from '@faker-js/faker'
import { getFor, postFor } from '../helpers'

const sessionUuid = '5aa28488-a4e9-4667-b474-9fc57ecd8517'
const oasysAssessmentUuid = 'abf9f8b0-1421-4064-823a-52369bdd2dd4'

export default async () => {
  await getFor({
    body: {},
    urlPath: `/session/${sessionUuid}/validate`,
  })

  await postFor({
    body: {
      uuid: sessionUuid,
      sessionId: 'MOCK_OASYS_SESSION_ID',
      accessLevel: 'READ_WRITE',
      assessmentUUID: oasysAssessmentUuid,
      userDisplayName: 'Probation User',
    },
    urlPath: `/session/${sessionUuid}`,
  })

  await postFor({
    body: {
      link: `http://localhost:3000/form/sbna-poc/start?sessionId=${sessionUuid}`,
    },
    urlPath: '/session/create',
  })

  await getFor({
    body: {
      givenName: faker.person.firstName(),
      familyName: faker.person.lastName(),
      dateOfBirth: faker.date.birthdate().toLocaleDateString(),
      crn: faker.helpers.fromRegExp(/D[0-9]{6}/),
      pnc: faker.helpers.fromRegExp(/01-[0-9]{9}A/).replace('-', '/'),
    },
    urlPattern: '/subject/.+?',
  })

  await postFor({
    body: {},
    urlPattern: '/assessment/.+?/answers',
  })

  await getFor({
    body: {},
    urlPattern: '/assessment/.+?/answers',
  })
}
