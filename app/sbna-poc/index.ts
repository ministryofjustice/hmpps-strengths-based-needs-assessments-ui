import { bootstrapFormConfiguration, loadFormsInDirectory } from '../common/utils'

const options = {
  journeyName: 'POC',
  journeyTitle: 'Proof of Concept Form',
  entryPoint: true,
}

const forms = loadFormsInDirectory(__dirname)

const router = bootstrapFormConfiguration(forms, options)

export default router
