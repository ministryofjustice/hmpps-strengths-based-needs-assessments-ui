import FormWizard from 'hmpo-form-wizard'

const steps: FormWizard.Steps = {
  '/start': {
    pageTitle: 'POC Form',
    reset: true,
    entryPoint: true,
    template: `forms/sbna-poc/start`,
  },
}

export default steps
