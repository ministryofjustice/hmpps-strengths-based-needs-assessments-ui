import FormWizard from 'hmpo-form-wizard'
import OneTimeLinkController from './controllers/oneTimeLinkController'
import SimpleOneTimeLinkController from './controllers/simpleOneTimeLinkController'

const steps: FormWizard.Steps = {
  '/start': {
    pageTitle: 'OAStub',
    controller: SimpleOneTimeLinkController,
    reset: true,
    entryPoint: true,
    template: `forms/oastub/otl-create-simple`,
    section: 'oastub',
  },
  '/otl': {
    pageTitle: 'OAStub',
    controller: OneTimeLinkController,
    reset: true,
    entryPoint: true,
    next: 'otl-copy',
    fields: [
      'oastub-assessment-uuid',
      'oastub-subject-given-name',
      'oastub-subject-family-name',
      'oastub-subject-gender',
      'oastub-subject-sexually-motivated-offence-history',
    ],
    template: `forms/oastub/otl-create`,
    section: 'oastub',
  },
  '/otl-copy': {
    pageTitle: 'OAStub',
    controller: OneTimeLinkController,
    template: `forms/oastub/otl-copy`,
    section: 'oastub',
    noPost: true,
  },
  '/otl-landing': {
    pageTitle: 'OAStub',
    controller: OneTimeLinkController,
    template: `forms/oastub/oasys-landing`,
    section: 'oastub',
    noPost: true,
  },
}

export default steps
