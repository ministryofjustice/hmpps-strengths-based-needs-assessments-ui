import { FormWizardRouter, getLatestVersionFrom, FormVersionInformation } from '../common'

export default class FormVersionResponse {
  latest: string

  available: FormVersionInformation[]

  static from(forms: FormWizardRouter[]): FormVersionResponse {
    const latest = getLatestVersionFrom(forms)
    return {
      latest: latest?.metaData.version || null,
      available: forms.map(it => ({
        version: it.metaData.version,
        active: it.metaData.active,
        tag: it.metaData.tag,
      })),
    }
  }
}
