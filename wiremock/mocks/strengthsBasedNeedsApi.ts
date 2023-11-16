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
    urlPattern: '/assessment/.+?/collection/.+?',
  })

  await postFor({
    body: {},
    urlPattern: '/assessment/.+?/answers',
  })

  await getFor({
    body: {
      drug_use_type: {
        type: 'CHECKBOX',
        description: 'Which drugs have [subject] used?',
        options: [
          { text: 'Amphetamines', value: 'AMPHETAMINES', kind: 'option' },
          { text: 'Benzodiazepines', value: 'BENZODIAZEPINES', kind: 'option' },
          { text: 'Cannabis', value: 'CANNABIS', kind: 'option' },
          { text: 'Cocaine', value: 'COCAINE', kind: 'option' },
          { text: 'Crack', value: 'CRACK', kind: 'option' },
          { text: 'Ecstasy', value: 'ECSTASY', kind: 'option' },
          { text: 'Hallucinogenics', value: 'HALLUCINOGENICS', kind: 'option' },
          { text: 'Heroin', value: 'HEROIN', kind: 'option' },
          { text: 'Methadone (not prescribed)', value: 'METHADONE_NOT_PRESCRIBED', kind: 'option' },
          { text: 'Other opiates', value: 'OTHER_OPIATES', kind: 'option' },
          { text: 'Non-prescribed medication', value: 'MISUSED_PRESCRIBED_DRUGS', kind: 'option' },
          { text: 'Psychoactive substances (spice)', value: 'SPICE', kind: 'option' },
          { text: 'Other', value: 'OTHER_DRUG', kind: 'option' },
        ],
        values: ['AMPHETAMINES'],
      },
      other_drug_details: { type: 'TEXT_AREA', description: 'Enter drug name', value: '' },
    },
    urlPattern: '/assessment/.+?/answers',
  })
}
