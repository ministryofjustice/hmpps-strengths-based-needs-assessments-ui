import sections, { Section } from '../../config/sections'
import { FieldsFactory } from '../common'
// TODO: Uncomment your fields import as you add it.
// import addDrugs from './add-drugs'
// import drugDetails from './drug-details'
// import drugUse from './drug-use'
// import drugUseAnalysis from './drug-use-analysis'
// import drugUseAnalysisSummary from './drug-use-analysis-summary'
// import drugUseHistory from './drug-use-history'
// import drugUseSummary from './drug-use-summary'

class DrugUse extends FieldsFactory {
  constructor(section: Section) {
    super(section)
    Object.assign(this, {
      // TODO: Uncomment your fields import as you add it.
      // ...addDrugs,
      // ...drugDetails,
      // ...drugUse,
      // ...drugUseAnalysis,
      // ...drugUseAnalysisSummary,
      // ...drugUseHistory,
      // ...drugUseSummary,
    })
  }
}

export default new DrugUse(sections.drugs)
