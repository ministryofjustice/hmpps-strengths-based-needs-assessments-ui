import steps from './steps/index'
import fields from './fields/index'
import { escape } from '../../utils/formatters'

export default {
  steps,
  fields,
  options: {
    active: true,
    version: '1.0',
    defaultFormatters: ['trim', 'hyphens', 'apostrophes', 'quotes', escape],
  },
}
