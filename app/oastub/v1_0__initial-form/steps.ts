import FormWizard from 'hmpo-form-wizard'
import StartController from './controllers/startController'
import BaseController from '../../common/controllers/baseController'
import OneTimeLinkController from './controllers/oneTimeLinkController'

const steps: FormWizard.Steps = {
  '/start': {
    pageTitle: 'OAStub',
    controller: BaseController,
    reset: true,
    entryPoint: true,
    template: `forms/oastub/start`,
    section: 'oastub',
  },
  '/create-one-time-link': {
    pageTitle: 'OAStub',
    controller: StartController,
    section: 'oastub',
  },
  '/otl': {
    pageTitle: 'OAStub',
    controller: OneTimeLinkController,
    reset: true,
    entryPoint: true,
    template: `forms/oastub/otl`,
    section: 'oastub',
  },
}

export default steps
