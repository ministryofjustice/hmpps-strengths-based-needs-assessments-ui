export type Drug = {
  value: string
  text: string
  injectable: boolean
}

export const drugsList: Array<Drug> = [
  { value: 'AMPHETAMINES', text: 'Amphetamines (including speed, methamphetamine)', injectable: true },
  { value: 'BENZODIAZEPINES', text: 'Benzodiazepines (including diazepam, temazepam)', injectable: true },
  { value: 'CANNABIS', text: 'Cannabis', injectable: false },
  { value: 'COCAINE', text: 'Cocaine', injectable: true },
  { value: 'CRACK', text: 'Crack cocaine', injectable: true },
  { value: 'ECSTASY', text: 'Ecstasy (MDMA)', injectable: false },
  { value: 'HALLUCINOGENICS', text: 'Hallucinogens', injectable: false },
  { value: 'HEROIN', text: 'Heroin', injectable: true },
  { value: 'METHADONE_NOT_PRESCRIBED', text: 'Methadone (not prescribed)', injectable: true },
  { value: 'MISUSED_PRESCRIBED_DRUGS', text: 'Prescribed drugs', injectable: true },
  { value: 'OTHER_OPIATES', text: 'Other opiates', injectable: true },
  { value: 'SOLVENTS', text: 'Solvents (including gases and glues)', injectable: false },
  { value: 'STEROIDS', text: 'Steroids', injectable: true },
  { value: 'SPICE', text: 'Synthetic cannabinoids (spice)', injectable: false },
  { value: 'OTHER_DRUG', text: 'Other', injectable: true },
]
