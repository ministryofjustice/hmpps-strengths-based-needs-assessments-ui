import FormWizard from 'hmpo-form-wizard'
import OneTimeLinkController from './controllers/oneTimeLinkController'
import CreateOneTimeLinkController from './controllers/createOneTimeLinkController';

const steps: FormWizard.Steps = {
  '/start': {
    pageTitle: 'OAStub',
    controller: CreateOneTimeLinkController,
    reset: true,
    entryPoint: true,
    template: `forms/oastub/start`,
    section: 'oastub',
  },
  '/landing': {
    pageTitle: 'OAStub',
    controller: OneTimeLinkController,
    reset: true,
    entryPoint: true,
    template: `forms/oastub/start`,
    section: 'oastub',
  },
  '/otl': {
    pageTitle: 'OAStub',
    controller: OneTimeLinkController,
    reset: true,
    entryPoint: true,
    next: 'otl-2',
    fields: ['oastub-assessment-uuid'],
    template: `forms/oastub/otl`,
    section: 'oastub',
  },
  '/otl-2': {
    pageTitle: 'OAStub',
    controller: CreateOneTimeLinkController,
    template: `forms/oastub/otl-create`,
    section: 'oastub',
  },
}

export default steps
