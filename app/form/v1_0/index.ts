import steps, { sectionConfigs } from './steps/index'
import { escape } from '../../utils/formatters'
import fields from './fields'
import sections from './config/sections';

import { Form } from '../index';

export default {
  steps: steps(),
  fields: fields(sectionConfigs),
  sections,
  options: {
    active: true,
    version: '1.0',
    defaultFormatters: ['trim', 'hyphens', 'apostrophes', 'quotes', escape],
  },
} as const satisfies Form
