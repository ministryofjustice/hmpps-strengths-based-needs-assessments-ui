import { bootstrapFormConfiguration, loadFormsInDirectory } from '../common/utils/forms'

const options = {
  journeyName: 'sbna-poc',
  journeyTitle: 'Strengths and needs',
  entryPoint: true,
}

const forms = loadFormsInDirectory(__dirname)

const router = bootstrapFormConfiguration(forms, options)

export default router
