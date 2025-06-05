import V1_0 from './v1_0';
import FormWizard from 'hmpo-form-wizard';
import { Section } from './common/section';

export type FormOptions = {
  version: string
  active: boolean
  defaultFormatters: Array<string | FormWizard.Formatter>
}

export type Form = {
  fields: FormWizard.Fields
  steps: FormWizard.Steps
  sections: Record<string, Section>
  options: FormOptions
}

export const formVersions: Record<string, Form> = {
  'v1.0': V1_0,
}
