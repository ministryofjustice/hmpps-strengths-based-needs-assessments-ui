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
      living_with: {
        type: 'CHECKBOX',
        values: ['CHILD_UNDER_18'],
        options: [
          {
            text: 'Family',
            value: 'FAMILY',
          },
          {
            text: 'Friends',
            value: 'FRIENDS',
          },
          {
            text: 'Partner',
            value: 'PARTNER',
          },
          {
            text: 'Child under 18 years old',
            value: 'CHILD_UNDER_18',
          },
          {
            text: 'Alone',
            value: 'ALONE',
          },
          {
            text: 'Other',
            value: 'OTHER',
          },
        ],
        description: 'Who does [subject] live with?',
      },
      living_with_children: {
        type: 'COLLECTION',
        collection: [
          {
            child_age: {
              type: 'TEXT',
              value: '12',
              description: 'Age',
            },
            child_name: {
              type: 'TEXT',
              value: 'Freya',
              description: 'Name',
            },
            child_gender: {
              type: 'RADIO',
              value: 'PREFER_NOT_TO_SAY',
              options: [
                {
                  text: 'Boy',
                  value: 'BOY',
                },
                {
                  text: 'Girl',
                  value: 'GIRL',
                },
                {
                  text: 'Non-binary',
                  value: 'NON_BINARY',
                },
                {
                  text: 'Prefer not to say',
                  value: 'PREFER_NOT_TO_SAY',
                },
              ],
              description: 'Select gender',
            },
            relationship_to_child: {
              type: 'RADIO',
              value: 'PARENT_OR_CARER',
              options: [
                {
                  text: 'Parent or carer',
                  value: 'PARENT_OR_CARER',
                },
                {
                  text: 'Family member',
                  value: 'FAMILY_MEMBER',
                },
                {
                  text: 'Friend',
                  value: 'FRIEND',
                },
                {
                  text: 'Other',
                  value: 'OTHER',
                },
              ],
              description: "Select [subject]'s relationship to the child",
            },
            child_date_of_birth: {
              type: 'TEXT',
              value: 'test',
              description: 'Date of birth',
            },
          },
        ],
      },
    },
    urlPattern: '/assessment/.+?/answers',
  })
}
