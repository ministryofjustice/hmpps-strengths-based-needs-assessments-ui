export interface DrugData {
  name: string
  isInjected: boolean
  hasTreatment: boolean
}

export const drugs: DrugData[] = [
  { name: 'Amphetamines', isInjected: true, hasTreatment: false },
  { name: 'Benzodiazepines', isInjected: true, hasTreatment: false },
  { name: 'Cannabis', isInjected: false, hasTreatment: false },
  { name: 'Cocaine hydrochloride', isInjected: true, hasTreatment: false },
  { name: 'Crack or cocaine', isInjected: true, hasTreatment: false },
  { name: 'Ecstasy (also known as MDMA)', isInjected: false, hasTreatment: false },
  { name: 'Hallucinogenics', isInjected: false, hasTreatment: false },
  { name: 'Heroin', isInjected: true, hasTreatment: true },
  { name: 'Methadone (not prescribed)', isInjected: true, hasTreatment: false },
  { name: 'Misused prescribed drugs', isInjected: true, hasTreatment: false },
  { name: 'Other opiates', isInjected: true, hasTreatment: false },
  { name: 'Solvents (including gases and glues)', isInjected: false, hasTreatment: false },
  { name: 'Spice', isInjected: false, hasTreatment: false },
  { name: 'Steroids', isInjected: true, hasTreatment: false },
  { name: 'Other', isInjected: true, hasTreatment: false },
]

const chunkSize = Math.ceil(drugs.length / 5)
const chunks = Array.from({ length: 5 }, (_, i) => drugs.slice(i * chunkSize, (i + 1) * chunkSize))

export const drugsPart1 = chunks[0]
export const drugsPart2 = chunks[1]
export const drugsPart3 = chunks[2]
export const drugsPart4 = chunks[3]
export const drugsPart5 = chunks[4]

expect([drugsPart1, drugsPart2, drugsPart3, drugsPart4, drugsPart5].flat()).to.deep.eq(
  drugs,
  'Data loss from array split',
)
