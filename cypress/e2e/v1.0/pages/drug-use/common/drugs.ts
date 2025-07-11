export interface DrugData {
  name: string
  injectable: boolean
}

export const drugs: DrugData[] = [
  { name: 'Amphetamines (including speed, methamphetamine)', injectable: true },
  { name: 'Benzodiazepines (including diazepam, temazepam)', injectable: true },
  { name: 'Cannabis', injectable: false },
  { name: 'Cocaine', injectable: true },
  { name: 'Crack cocaine', injectable: true },
  { name: 'Ecstasy (MDMA)', injectable: false },
  { name: 'Hallucinogens', injectable: false },
  { name: 'Heroin', injectable: true },
  { name: 'Methadone (not prescribed)', injectable: true },
  { name: 'Prescribed drugs', injectable: true },
  { name: 'Other opiates', injectable: true },
  { name: 'Solvents (including gases and glues)', injectable: false },
  { name: 'Steroids', injectable: true },
  { name: 'Synthetic cannabinoids (spice)', injectable: false },
  { name: 'Other', injectable: true },
]

export const drugName = (drug: string) => (drug === 'Other' ? 'Cake' : drug)
