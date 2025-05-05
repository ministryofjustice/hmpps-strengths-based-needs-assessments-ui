import FormWizard from 'hmpo-form-wizard'
import sections, { Section } from '../../config/sections'
import { FieldsFactory } from '../common'
// TODO: Uncomment your fields import as you add it.
import addDrugs from './add-drugs'
// import drugDetails from './drug-details'
import drugUse from './drug-use'
import drugUseAnalysis from './drug-use-analysis'
// import drugUseAnalysisSummary from './drug-use-analysis-summary'
import drugUseHistory from './drug-use-history'
// import drugUseSummary from './drug-use-summary'

class DrugUse extends FieldsFactory {
  readonly addDrugs: Record<string, FormWizard.Field>

  readonly drugDetails: Record<string, FormWizard.Field>

  readonly drugUse: Record<string, FormWizard.Field>

  readonly drugUseAnalysis: Record<string, FormWizard.Field>

  readonly drugUseAnalysisSummary: Record<string, FormWizard.Field>

  readonly drugUseHistory: Record<string, FormWizard.Field>

  readonly drugUseSummary: Record<string, FormWizard.Field>

  constructor(section: Section) {
    super(section)
    // TODO: Uncomment your fields import as you add it.
    this.addDrugs = addDrugs
    // this.drugDetails = drugDetails
    this.drugUse = drugUse
    this.drugUseAnalysis = drugUseAnalysis
    // this.drugUseAnalysisSummary = drugUseAnalysisSummary
    this.drugUseHistory = drugUseHistory
    // this.drugUseSummary = drugUseSummary
  }
}

export default new DrugUse(sections.drugs)
