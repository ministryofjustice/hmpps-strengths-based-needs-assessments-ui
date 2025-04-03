import steps, { sectionConfigs } from './steps/index'
import { escape } from '../../utils/formatters'
import fields from './fields'

export default {
  steps: steps(),
  fields: fields(sectionConfigs),
  sections: sectionConfigs,
  options: {
    active: true,
    version: '1.0',
    defaultFormatters: ['trim', 'hyphens', 'apostrophes', 'quotes', escape]
  },
}
